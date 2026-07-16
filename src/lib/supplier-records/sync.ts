import { eq } from "drizzle-orm";

import { db } from "@/db";
import { supplierRecordItems, supplierRecordSuppliers } from "@/db/schema";
import { readSheetTab } from "@/lib/google/sheets-client";

export interface SupplierRecordsSyncSummary {
  suppliersUpserted: number;
  itemsUpserted: number;
}

/**
 * Pulls the "Suppliers" and "Items" tabs from the connected Sheet and upserts
 * them keyed on (integrationId, sheetRowId) — the sheet row number — so
 * re-running this after Molly edits or appends rows updates in place instead
 * of duplicating. Suppliers sync first so items can resolve `supplierId` by
 * matching the "Supplier" column against supplier names already written.
 */
export async function syncSupplierRecordsFromSheet(
  integrationId: string,
  accessToken: string,
  spreadsheetId: string
): Promise<SupplierRecordsSyncSummary> {
  const [supplierRows, itemRows] = await Promise.all([
    readSheetTab(accessToken, spreadsheetId, "Suppliers"),
    readSheetTab(accessToken, spreadsheetId, "Items"),
  ]);

  const now = new Date();

  for (const row of supplierRows) {
    const v = row.values;
    const values = {
      integrationId,
      sheetRowId: String(row.rowNumber),
      name: v.supplier_name || v.name || "",
      contactPerson: v.contact_person || null,
      email: v.email || null,
      phone: v.phone_number || v.phone || null,
      website: v.website || null,
      address: v.address || null,
      productsSupplied: v.products_supplied || null,
      notes: v.notes || null,
      sourceUpdatedAt: v.last_updated_date || v.last_updated || null,
      lastSyncedAt: now,
      updatedAt: now,
    };
    await db
      .insert(supplierRecordSuppliers)
      .values(values)
      .onConflictDoUpdate({
        target: [supplierRecordSuppliers.integrationId, supplierRecordSuppliers.sheetRowId],
        set: values,
      });
  }

  const existingSuppliers = await db.query.supplierRecordSuppliers.findMany({
    where: eq(supplierRecordSuppliers.integrationId, integrationId),
  });
  const supplierIdByName = new Map(
    existingSuppliers.map((s) => [s.name.trim().toLowerCase(), s.id])
  );

  for (const row of itemRows) {
    const v = row.values;
    const supplierName = v.supplier || v.supplier_name || "";
    const costPriceDigits = (v.cost_price || "").replace(/[^0-9.]/g, "");
    const values = {
      integrationId,
      sheetRowId: String(row.rowNumber),
      name: v.item_name || v.name || "",
      category: v.category || null,
      supplierId: supplierIdByName.get(supplierName.trim().toLowerCase()) ?? null,
      supplierName: supplierName || null,
      supplierContact: v.supplier_contact || null,
      sku: v.product_code_sku || v.sku || v.product_code || null,
      costPrice: costPriceDigits || null,
      packSize: v.pack_size || null,
      notes: v.notes || null,
      sourceUpdatedAt: v.last_updated_date || v.last_updated || null,
      lastSyncedAt: now,
      updatedAt: now,
    };
    await db
      .insert(supplierRecordItems)
      .values(values)
      .onConflictDoUpdate({
        target: [supplierRecordItems.integrationId, supplierRecordItems.sheetRowId],
        set: values,
      });
  }

  return { suppliersUpserted: supplierRows.length, itemsUpserted: itemRows.length };
}
