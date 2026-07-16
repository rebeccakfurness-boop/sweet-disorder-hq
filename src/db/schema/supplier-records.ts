import { pgTable, uuid, text, timestamp, numeric, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { integrations } from "./integrations";

// ---------------------------------------------------------------------------
// Supplier Records — items + suppliers directory sourced from a Google Sheet
// (see src/lib/google/sheets-client.ts and src/lib/supplier-records/sync.ts).
// Distinct from the `suppliers` table in business.ts, which tracks
// production-floor compliance for a fixed short list — this is the full,
// growing items+suppliers directory Molly maintains in the Sheet.
//
// `sheetRowId` is the stable identity of a Sheet row (its row number), used to
// upsert on every sync so edits/appends in the Sheet are reflected without
// duplicating rows. `sourceUpdatedAt` mirrors the Sheet's own "Last updated"
// column (kept as free text since it's operator-entered, not a real
// timestamp); `lastSyncedAt` is when Project HQ last pulled it in.
// ---------------------------------------------------------------------------

export const supplierRecordSuppliers = pgTable(
  "supplier_record_suppliers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .references(() => integrations.id, { onDelete: "cascade" })
      .notNull(),
    sheetRowId: text("sheet_row_id").notNull(),
    name: text("name").notNull(),
    contactPerson: text("contact_person"),
    email: text("email"),
    phone: text("phone"),
    website: text("website"),
    address: text("address"),
    productsSupplied: text("products_supplied"),
    notes: text("notes"),
    sourceUpdatedAt: text("source_updated_at"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sheetRowIdx: uniqueIndex("supplier_record_suppliers_integration_row_idx").on(
      table.integrationId,
      table.sheetRowId
    ),
  })
);

export const supplierRecordItems = pgTable(
  "supplier_record_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .references(() => integrations.id, { onDelete: "cascade" })
      .notNull(),
    sheetRowId: text("sheet_row_id").notNull(),
    name: text("name").notNull(),
    category: text("category"),
    // Resolved by name-matching against supplierRecordSuppliers during sync;
    // supplierName is kept denormalized so the Items tab still displays a
    // supplier even when the match fails (typo, supplier not yet in the
    // Suppliers tab, etc).
    supplierId: uuid("supplier_id").references(() => supplierRecordSuppliers.id, {
      onDelete: "set null",
    }),
    supplierName: text("supplier_name"),
    supplierContact: text("supplier_contact"),
    sku: text("sku"),
    costPrice: numeric("cost_price", { precision: 10, scale: 2 }),
    packSize: text("pack_size"),
    notes: text("notes"),
    sourceUpdatedAt: text("source_updated_at"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sheetRowIdx: uniqueIndex("supplier_record_items_integration_row_idx").on(
      table.integrationId,
      table.sheetRowId
    ),
  })
);

export const supplierRecordSuppliersRelations = relations(supplierRecordSuppliers, ({ one, many }) => ({
  integration: one(integrations, {
    fields: [supplierRecordSuppliers.integrationId],
    references: [integrations.id],
  }),
  items: many(supplierRecordItems),
}));

export const supplierRecordItemsRelations = relations(supplierRecordItems, ({ one }) => ({
  integration: one(integrations, {
    fields: [supplierRecordItems.integrationId],
    references: [integrations.id],
  }),
  supplier: one(supplierRecordSuppliers, {
    fields: [supplierRecordItems.supplierId],
    references: [supplierRecordSuppliers.id],
  }),
}));
