import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import {
  WholesaleOrderApprovalError,
  updateOrder,
  type UpdateOrderInput,
} from "@/lib/wholesale-orders/repository";

const EDITABLE_FIELDS = [
  "storeName",
  "contactPerson",
  "contactEmail",
  "contactPhone",
  "address",
  "orderRequiredDate",
  "additionalNotes",
  "lineItems",
  "status",
  "reviewedBy",
] as const;

function pickPatch(body: Record<string, unknown>): UpdateOrderInput {
  const patch: UpdateOrderInput = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      (patch as Record<string, unknown>)[field] = body[field];
    }
  }
  return patch;
}

/** Saves review edits and/or an approval status change for a staged order. */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set — this review session isn't backed by a database yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  try {
    const order = await updateOrder(params.id, pickPatch(body));
    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof WholesaleOrderApprovalError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Failed to update this order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
