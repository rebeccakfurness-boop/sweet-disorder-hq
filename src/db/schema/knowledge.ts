import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  uniqueIndex,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { vector } from "./custom-types";
import { integrations } from "./integrations";

// Matches the folder categories Molly listed for the Knowledge Hub. Kept as
// its own enum (rather than reusing folder names) so category assignment is
// a business decision, not an accident of how someone organised Drive —
// `src/lib/knowledge/categories.ts` maps folder paths to these values.
export const documentCategoryEnum = pgEnum("document_category", [
  "production",
  "hr",
  "marketing",
  "finance",
  "operations",
  "supplier",
  "training",
  "policy",
  "template",
  "checklist",
  "form",
  "troubleshooting",
  "uncategorized",
]);

export const fileTypeEnum = pgEnum("file_type", [
  "doc",
  "sheet",
  "slide",
  "pdf",
  "image",
  "video",
  "folder",
  "other",
]);

export const documentSyncStatusEnum = pgEnum("document_sync_status", [
  "synced",
  "pending",
  "error",
  "deleted",
]);

// Mirrors the provider's folder tree. Self-referencing so arbitrarily deep
// Drive nesting round-trips without flattening; `path` is a denormalised
// display string ("Production / SOPs") so the UI never has to walk the tree
// just to render a breadcrumb.
export const documentFolders = pgTable(
  "document_folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .references(() => integrations.id, { onDelete: "cascade" })
      .notNull(),
    externalId: text("external_id").notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => documentFolders.id, {
      onDelete: "cascade",
    }),
    parentExternalId: text("parent_external_id"),
    name: text("name").notNull(),
    path: text("path"),
    category: documentCategoryEnum("category").default("uncategorized").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    externalIdx: uniqueIndex("document_folders_integration_external_idx").on(
      table.integrationId,
      table.externalId
    ),
  })
);

// One row per synced file. Never stores file contents — `url` links back to
// Drive as the source of truth, `contentText` is an optional plain-text
// extraction used for keyword search and (later) chunking.
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .references(() => integrations.id, { onDelete: "cascade" })
      .notNull(),
    folderId: uuid("folder_id").references(() => documentFolders.id, { onDelete: "set null" }),
    externalId: text("external_id").notNull(),
    // Denormalized alongside folderId so a sync run can detect a move
    // (parentExternalId changed) with a plain string comparison, no join.
    parentExternalId: text("parent_external_id"),
    name: text("name").notNull(),
    category: documentCategoryEnum("category").default("uncategorized").notNull(),
    fileType: fileTypeEnum("file_type").default("other").notNull(),
    mimeType: text("mime_type"),
    url: text("url"),
    iconUrl: text("icon_url"),
    ownerName: text("owner_name"),
    ownerEmail: text("owner_email"),
    // Drive's `version` counter — bumps on every content or metadata change,
    // cheap way to skip re-processing a file that hasn't actually changed.
    version: text("version"),
    // Drive's md5Checksum — used to tell "content actually changed" apart
    // from "someone touched the metadata", so re-indexing/re-chunking only
    // happens when it needs to.
    checksum: text("checksum"),
    // Populated by a future text-extraction step (Drive export for Docs/
    // Sheets, OCR/parsing for PDFs and images). Null until then; full-text
    // search below degrades gracefully to matching on `name` alone.
    contentText: text("content_text"),
    syncStatus: documentSyncStatusEnum("sync_status").default("pending").notNull(),
    externalCreatedAt: timestamp("external_created_at", { withTimezone: true }),
    externalModifiedAt: timestamp("external_modified_at", { withTimezone: true }),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    // Soft-deleted when the provider reports the file gone, rather than
    // deleting the row — keeps sync history and search results explainable.
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    externalIdx: uniqueIndex("documents_integration_external_idx").on(
      table.integrationId,
      table.externalId
    ),
  })
);

// RAG groundwork: a document gets split into overlapping chunks once an
// embedding pipeline exists. `embedding` is nullable and unused until then —
// see `custom-types.ts` for why the column can already hold a real vector.
export const documentChunks = pgTable(
  "document_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .references(() => documents.id, { onDelete: "cascade" })
      .notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    content: text("content").notNull(),
    tokenCount: integer("token_count"),
    embedding: vector("embedding", 1536),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    documentChunkIdx: uniqueIndex("document_chunks_document_chunk_idx").on(
      table.documentId,
      table.chunkIndex
    ),
  })
);

export const documentFoldersRelations = relations(documentFolders, ({ one, many }) => ({
  integration: one(integrations, {
    fields: [documentFolders.integrationId],
    references: [integrations.id],
  }),
  parent: one(documentFolders, {
    fields: [documentFolders.parentId],
    references: [documentFolders.id],
    relationName: "folder_children",
  }),
  children: many(documentFolders, { relationName: "folder_children" }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  integration: one(integrations, {
    fields: [documents.integrationId],
    references: [integrations.id],
  }),
  folder: one(documentFolders, {
    fields: [documents.folderId],
    references: [documentFolders.id],
  }),
  chunks: many(documentChunks),
}));

export const documentChunksRelations = relations(documentChunks, ({ one }) => ({
  document: one(documents, {
    fields: [documentChunks.documentId],
    references: [documents.id],
  }),
}));
