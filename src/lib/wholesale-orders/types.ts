export type WholesaleOrderRegion = "NZ" | "AUS";

export type WholesaleOrderLineConfidence = "high" | "low";

export interface WholesaleOrderLine {
  itemCode: string | null;
  productDescription: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  confidence: WholesaleOrderLineConfidence;
  rawText: string | null;
}

// Mirrors exactly what the "Read order" AI extraction returns (see
// src/lib/wholesale-orders/prompt.ts) — the store-details fields plus the
// parsed line items.
export interface WholesaleOrderExtraction {
  storeName: string | null;
  contactPerson: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  orderRequiredDate: string | null;
  additionalNotes: string | null;
  lineItems: WholesaleOrderLine[];
}

export type WholesaleOrderStatus = "pending_review" | "approved" | "sent_to_xero" | "error";

// A staged order once it's been through "Read order" and saved (see
// src/lib/wholesale-orders/repository.ts) — the extraction fields plus
// review/approval state. `id` is null when it couldn't be persisted (no
// database configured) — the review UI works the same either way, it just
// can't survive a page reload in that case.
export interface WholesaleOrderRecord extends WholesaleOrderExtraction {
  id: string | null;
  region: WholesaleOrderRegion;
  photoUrl: string | null;
  status: WholesaleOrderStatus;
  xeroQuoteId: string | null;
  xeroQuoteUrl: string | null;
  createdAt: string;
  reviewedBy: string | null;
}
