import { eq } from "drizzle-orm";

import { db } from "@/db";
import { wholesaleOrders } from "@/db/schema";
import type {
  WholesaleOrderExtraction,
  WholesaleOrderLine,
  WholesaleOrderRecord,
  WholesaleOrderRegion,
  WholesaleOrderStatus,
} from "./types";

export class WholesaleOrderApprovalError extends Error {}

function mapRow(row: typeof wholesaleOrders.$inferSelect): WholesaleOrderRecord {
  return {
    id: row.id,
    region: row.region as WholesaleOrderRegion,
    photoUrl: row.photoUrl,
    storeName: row.storeName,
    contactPerson: row.contactPerson,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    address: row.address,
    orderRequiredDate: row.orderRequiredDate,
    additionalNotes: row.additionalNotes,
    lineItems: row.lineItems as WholesaleOrderLine[],
    status: row.status as WholesaleOrderStatus,
    xeroQuoteId: row.xeroQuoteId,
    xeroQuoteUrl: row.xeroQuoteUrl,
    createdAt: row.createdAt.toISOString(),
    reviewedBy: row.reviewedBy,
  };
}

export async function createStagedOrder(
  region: WholesaleOrderRegion,
  extraction: WholesaleOrderExtraction
): Promise<WholesaleOrderRecord> {
  const [row] = await db
    .insert(wholesaleOrders)
    .values({
      region,
      storeName: extraction.storeName,
      contactPerson: extraction.contactPerson,
      contactEmail: extraction.contactEmail,
      contactPhone: extraction.contactPhone,
      address: extraction.address,
      orderRequiredDate: extraction.orderRequiredDate,
      additionalNotes: extraction.additionalNotes,
      lineItems: extraction.lineItems,
      status: "pending_review",
    })
    .returning();
  return mapRow(row);
}

export async function getOrderById(id: string): Promise<WholesaleOrderRecord | null> {
  const row = await db.query.wholesaleOrders.findFirst({ where: eq(wholesaleOrders.id, id) });
  return row ? mapRow(row) : null;
}

export interface UpdateOrderInput {
  storeName?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  orderRequiredDate?: string | null;
  additionalNotes?: string | null;
  lineItems?: WholesaleOrderLine[];
  status?: WholesaleOrderStatus;
  reviewedBy?: string | null;
}

/**
 * Applies edits and/or a status change. Moving to "approved" is refused
 * while any line item is still flagged "low" confidence — editing a line's
 * fields is what clears that flag (see the upload-form review UI), so this
 * guard is what actually stops an unverified guess reaching Xero later.
 */
export async function updateOrder(id: string, patch: UpdateOrderInput): Promise<WholesaleOrderRecord> {
  if (patch.status === "approved") {
    const lineItems = patch.lineItems ?? (await getOrderById(id))?.lineItems ?? [];
    if (lineItems.some((line) => line.confidence === "low")) {
      throw new WholesaleOrderApprovalError(
        "Every line item must be resolved (no low-confidence rows) before this order can be approved."
      );
    }
  }

  const [row] = await db.update(wholesaleOrders).set(patch).where(eq(wholesaleOrders.id, id)).returning();
  return mapRow(row);
}
