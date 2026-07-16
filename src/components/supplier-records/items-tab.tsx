"use client";

import { SupplierRecordsTable, type RecordsColumn } from "@/components/supplier-records/records-table";
import { formatDate } from "@/lib/utils";
import type { SupplierRecordItem } from "@/lib/supplier-records/types";

function formatCostPrice(price: number | null): string {
  if (price === null) return "—";
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(price);
}

const columns: RecordsColumn<SupplierRecordItem>[] = [
  {
    key: "name",
    label: "Item",
    sortValue: (item) => item.name.toLowerCase(),
    render: (item) => <span className="font-medium text-foreground">{item.name}</span>,
  },
  {
    key: "category",
    label: "Category",
    sortValue: (item) => item.category.toLowerCase(),
    render: (item) => <span className="text-sm text-muted-foreground">{item.category || "—"}</span>,
  },
  {
    key: "supplier",
    label: "Supplier",
    sortValue: (item) => item.supplierName.toLowerCase(),
    render: (item) => (
      <div className="text-sm">
        <div className="text-foreground">{item.supplierName || "—"}</div>
        {item.supplierContact ? <div className="text-xs text-muted-foreground">{item.supplierContact}</div> : null}
      </div>
    ),
  },
  {
    key: "sku",
    label: "SKU",
    sortValue: (item) => item.sku.toLowerCase(),
    render: (item) => <span className="text-sm text-muted-foreground">{item.sku || "—"}</span>,
  },
  {
    key: "costPrice",
    label: "Cost Price",
    sortValue: (item) => item.costPrice ?? -1,
    render: (item) => <span className="text-sm text-foreground">{formatCostPrice(item.costPrice)}</span>,
  },
  {
    key: "packSize",
    label: "Pack Size",
    render: (item) => <span className="text-sm text-muted-foreground">{item.packSize || "—"}</span>,
  },
  {
    key: "notes",
    label: "Notes",
    render: (item) => (
      <span className="block max-w-xs truncate text-sm text-muted-foreground" title={item.notes}>
        {item.notes || "—"}
      </span>
    ),
  },
  {
    key: "lastUpdated",
    label: "Last Updated",
    sortValue: (item) => item.lastUpdated,
    render: (item) => <span className="text-sm text-muted-foreground">{formatDate(item.lastUpdated)}</span>,
  },
];

function matchesQuery(item: SupplierRecordItem, query: string): boolean {
  const q = query.toLowerCase();
  return [item.name, item.category, item.supplierName, item.sku, item.notes].some((field) =>
    field.toLowerCase().includes(q)
  );
}

export function ItemsTab() {
  return (
    <SupplierRecordsTable
      fetchUrl="/api/supplier-records/items"
      dataKey="items"
      columns={columns}
      searchPlaceholder="Search items, categories, suppliers, or SKUs…"
      emptyLabel="No items yet — they'll appear here once the Sheet is connected and synced."
      matchesQuery={matchesQuery}
    />
  );
}
