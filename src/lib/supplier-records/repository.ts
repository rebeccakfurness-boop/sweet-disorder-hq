import { ilike, or } from "drizzle-orm";

import { db } from "@/db";
import { supplierRecordItems, supplierRecordSuppliers } from "@/db/schema";
import type { SupplierRecordItem, SupplierRecordSupplier } from "./types";

function mapSupplierRow(row: typeof supplierRecordSuppliers.$inferSelect): SupplierRecordSupplier {
  return {
    id: row.id,
    name: row.name,
    contactPerson: row.contactPerson ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    website: row.website ?? "",
    address: row.address ?? "",
    productsSupplied: row.productsSupplied ?? "",
    notes: row.notes ?? "",
    lastUpdated: row.sourceUpdatedAt ?? row.updatedAt.toISOString(),
  };
}

function mapItemRow(row: typeof supplierRecordItems.$inferSelect): SupplierRecordItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? "",
    supplierName: row.supplierName ?? "",
    supplierContact: row.supplierContact ?? "",
    sku: row.sku ?? "",
    costPrice: row.costPrice !== null ? Number(row.costPrice) : null,
    packSize: row.packSize ?? "",
    notes: row.notes ?? "",
    lastUpdated: row.sourceUpdatedAt ?? row.updatedAt.toISOString(),
  };
}

export interface ListFilters {
  query?: string;
}

export async function listSuppliers(filters: ListFilters = {}): Promise<SupplierRecordSupplier[]> {
  let where;
  if (filters.query) {
    const term = `%${filters.query}%`;
    where = or(
      ilike(supplierRecordSuppliers.name, term),
      ilike(supplierRecordSuppliers.contactPerson, term),
      ilike(supplierRecordSuppliers.email, term),
      ilike(supplierRecordSuppliers.productsSupplied, term),
      ilike(supplierRecordSuppliers.notes, term)
    );
  }

  const rows = await db.query.supplierRecordSuppliers.findMany({
    where,
    orderBy: (s, { asc }) => [asc(s.name)],
  });
  return rows.map(mapSupplierRow);
}

export async function listItems(filters: ListFilters = {}): Promise<SupplierRecordItem[]> {
  let where;
  if (filters.query) {
    const term = `%${filters.query}%`;
    where = or(
      ilike(supplierRecordItems.name, term),
      ilike(supplierRecordItems.category, term),
      ilike(supplierRecordItems.supplierName, term),
      ilike(supplierRecordItems.sku, term),
      ilike(supplierRecordItems.notes, term)
    );
  }

  const rows = await db.query.supplierRecordItems.findMany({
    where,
    orderBy: (i, { asc }) => [asc(i.name)],
  });
  return rows.map(mapItemRow);
}
