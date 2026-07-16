import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { listItems } from "@/lib/supplier-records/repository";
import { mockSupplierRecordItems } from "@/lib/supplier-records/mock";
import type { SupplierRecordItem } from "@/lib/supplier-records/types";

function matchesQuery(item: SupplierRecordItem, query: string): boolean {
  const q = query.toLowerCase();
  return [item.name, item.category, item.supplierName, item.sku, item.notes].some((field) =>
    field.toLowerCase().includes(q)
  );
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!isDatabaseConfigured()) {
    const items = query ? mockSupplierRecordItems.filter((item) => matchesQuery(item, query)) : mockSupplierRecordItems;
    return NextResponse.json({ configured: false, items });
  }

  try {
    const items = await listItems({ query: query || undefined });
    return NextResponse.json({ configured: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load items.";
    return NextResponse.json({ configured: true, error: message }, { status: 500 });
  }
}
