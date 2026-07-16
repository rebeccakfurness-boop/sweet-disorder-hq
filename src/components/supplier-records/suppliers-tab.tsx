"use client";

import { SupplierRecordsTable, type RecordsColumn } from "@/components/supplier-records/records-table";
import { formatDate } from "@/lib/utils";
import type { SupplierRecordSupplier } from "@/lib/supplier-records/types";

const columns: RecordsColumn<SupplierRecordSupplier>[] = [
  {
    key: "name",
    label: "Supplier",
    sortValue: (supplier) => supplier.name.toLowerCase(),
    render: (supplier) => <span className="font-medium text-foreground">{supplier.name}</span>,
  },
  {
    key: "contact",
    label: "Contact",
    sortValue: (supplier) => supplier.contactPerson.toLowerCase(),
    render: (supplier) => (
      <div className="text-sm">
        <div className="text-foreground">{supplier.contactPerson || "—"}</div>
        {supplier.email ? <div className="text-xs text-muted-foreground">{supplier.email}</div> : null}
      </div>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (supplier) => <span className="text-sm text-muted-foreground">{supplier.phone || "—"}</span>,
  },
  {
    key: "website",
    label: "Website",
    render: (supplier) =>
      supplier.website ? (
        <a
          href={supplier.website.startsWith("http") ? supplier.website : `https://${supplier.website}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {supplier.website}
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    key: "address",
    label: "Address",
    render: (supplier) => (
      <span className="block max-w-xs truncate text-sm text-muted-foreground" title={supplier.address}>
        {supplier.address || "—"}
      </span>
    ),
  },
  {
    key: "productsSupplied",
    label: "Products Supplied",
    render: (supplier) => (
      <span className="block max-w-xs truncate text-sm text-muted-foreground" title={supplier.productsSupplied}>
        {supplier.productsSupplied || "—"}
      </span>
    ),
  },
  {
    key: "notes",
    label: "Notes",
    render: (supplier) => (
      <span className="block max-w-xs truncate text-sm text-muted-foreground" title={supplier.notes}>
        {supplier.notes || "—"}
      </span>
    ),
  },
  {
    key: "lastUpdated",
    label: "Last Updated",
    sortValue: (supplier) => supplier.lastUpdated,
    render: (supplier) => <span className="text-sm text-muted-foreground">{formatDate(supplier.lastUpdated)}</span>,
  },
];

function matchesQuery(supplier: SupplierRecordSupplier, query: string): boolean {
  const q = query.toLowerCase();
  return [
    supplier.name,
    supplier.contactPerson,
    supplier.email,
    supplier.productsSupplied,
    supplier.notes,
  ].some((field) => field.toLowerCase().includes(q));
}

export function SuppliersTab() {
  return (
    <SupplierRecordsTable
      fetchUrl="/api/supplier-records/suppliers"
      dataKey="suppliers"
      columns={columns}
      searchPlaceholder="Search suppliers, contacts, or products supplied…"
      emptyLabel="No suppliers yet — they'll appear here once the Sheet is connected and synced."
      matchesQuery={matchesQuery}
    />
  );
}
