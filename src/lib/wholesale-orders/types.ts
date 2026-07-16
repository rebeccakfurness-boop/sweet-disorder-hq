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
