import { and, eq, ilike, isNull, or } from "drizzle-orm";

import { db } from "@/db";
import { documentFolders, documents } from "@/db/schema";
import type { DocumentCategory } from "./categories";
import type { KnowledgeDocument, KnowledgeFolder } from "./types";
import type { FileType } from "./file-types";

function mapFolderRow(row: typeof documentFolders.$inferSelect): KnowledgeFolder {
  return {
    id: row.id,
    externalId: row.externalId,
    parentId: row.parentId,
    name: row.name,
    path: row.path ?? row.name,
    category: row.category as DocumentCategory,
  };
}

function mapDocumentRow(row: typeof documents.$inferSelect): KnowledgeDocument {
  return {
    id: row.id,
    externalId: row.externalId,
    folderId: row.folderId,
    name: row.name,
    category: row.category as DocumentCategory,
    fileType: row.fileType as FileType,
    url: row.url ?? "",
    ownerName: row.ownerName ?? "Unknown",
    lastModifiedAt: (row.externalModifiedAt ?? row.updatedAt).toISOString(),
    syncStatus: row.syncStatus,
  };
}

export async function listFolders(integrationId?: string): Promise<KnowledgeFolder[]> {
  const rows = await db.query.documentFolders.findMany({
    where: integrationId ? eq(documentFolders.integrationId, integrationId) : undefined,
    orderBy: (folders, { asc }) => [asc(folders.path)],
  });
  return rows.map(mapFolderRow);
}

export interface ListDocumentsFilters {
  integrationId?: string;
  category?: DocumentCategory;
  folderId?: string;
  query?: string;
}

export async function listDocuments(filters: ListDocumentsFilters = {}): Promise<KnowledgeDocument[]> {
  const conditions = [isNull(documents.deletedAt)];
  if (filters.integrationId) conditions.push(eq(documents.integrationId, filters.integrationId));
  if (filters.category) conditions.push(eq(documents.category, filters.category));
  if (filters.folderId) conditions.push(eq(documents.folderId, filters.folderId));
  if (filters.query) {
    const term = `%${filters.query}%`;
    // ilike on name always applies; contentText may still be null for most
    // rows until a text-extraction step exists, so this degrades to a
    // name-only match rather than erroring on a null column.
    conditions.push(or(ilike(documents.name, term), ilike(documents.contentText, term))!);
  }

  const rows = await db.query.documents.findMany({
    where: and(...conditions),
    orderBy: (docs, { asc }) => [asc(docs.name)],
  });
  return rows.map(mapDocumentRow);
}

export async function getDocumentById(id: string): Promise<KnowledgeDocument | null> {
  const row = await db.query.documents.findFirst({ where: eq(documents.id, id) });
  return row ? mapDocumentRow(row) : null;
}
