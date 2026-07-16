export type WholesaleOrderRegion = "NZ" | "AUS";

export type WholesaleOrderLineConfidence = "high" | "low";

export interface WholesaleOrderLine {
  id: string;
  itemCode: string | null;
  productDescription: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  confidence: WholesaleOrderLineConfidence;
  rawText: string | null;
}
