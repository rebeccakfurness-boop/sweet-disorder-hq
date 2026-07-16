import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { listSuppliers } from "@/lib/supplier-records/repository";
import { mockSupplierRecordSuppliers } from "@/lib/supplier-records/mock";
import type { SupplierRecordSupplier } from "@/lib/supplier-records/types";

function matchesQuery(supplier: SupplierRecordSupplier, query: string): boolean {
  const q = query.toLowerCase();
  return [supplier.name, supplier.contactPerson, supplier.email, supplier.productsSupplied, supplier.notes].some(
    (field) => field.toLowerCase().includes(q)
  );
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!isDatabaseConfigured()) {
    const suppliers = query
      ? mockSupplierRecordSuppliers.filter((supplier) => matchesQuery(supplier, query))
      : mockSupplierRecordSuppliers;
    return NextResponse.json({ configured: false, suppliers });
  }

  try {
    const suppliers = await listSuppliers({ query: query || undefined });
    return NextResponse.json({ configured: true, suppliers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load suppliers.";
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}
