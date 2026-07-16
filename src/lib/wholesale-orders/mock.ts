// Mock data for the Wholesale Orders photo-upload flow — same pattern as
// src/lib/knowledge/mock.ts and src/lib/supplier-records/mock.ts. The API
// route (src/app/api/wholesale-orders/read/route.ts) returns this instead of
// calling the Anthropic API when ANTHROPIC_API_KEY isn't set, so the page
// keeps working end to end before a real key is configured.
import type { WholesaleOrderExtraction, WholesaleOrderRegion } from "./types";

export const mockWholesaleOrderExtractionByRegion: Record<WholesaleOrderRegion, WholesaleOrderExtraction> = {
  NZ: {
    storeName: "The Gift Nook",
    contactPerson: "Sarah Mitchell",
    contactEmail: "sarah@thegiftnook.co.nz",
    contactPhone: "021 555 0142",
    address: "14 High St, Silverdale",
    orderRequiredDate: "2026-08-01",
    additionalNotes: "Please deliver to the back entrance.",
    lineItems: [
      {
        itemCode: "SDP89",
        productDescription: "Another Year Wiser",
        variant: "Bottle",
        quantity: 24,
        unitPrice: 7.65,
        confidence: "high",
        rawText: null,
      },
      {
        itemCode: "SDP61",
        productDescription: "Chill Pills",
        variant: "Bottle",
        quantity: 24,
        unitPrice: 7.65,
        confidence: "high",
        rawText: null,
      },
      {
        itemCode: "SDAB01",
        productDescription: "Total Legend",
        variant: "Badge",
        quantity: 12,
        unitPrice: 7.2,
        confidence: "high",
        rawText: null,
      },
      {
        itemCode: null,
        productDescription: "Mixed candy jar (variant unclear)",
        variant: "Unclear",
        quantity: 6,
        unitPrice: 7.65,
        confidence: "low",
        rawText: "6 x mixd candy jr asst",
      },
    ],
  },
  AUS: {
    storeName: "Novelty & Co",
    contactPerson: "James Whitfield",
    contactEmail: "james@noveltyandco.com.au",
    contactPhone: "0412 555 098",
    address: "22 Smith St, Fitzroy VIC",
    orderRequiredDate: "2026-08-05",
    additionalNotes: null,
    lineItems: [
      {
        itemCode: "ASDP89",
        productDescription: "Another Year Wiser",
        variant: "Bottle",
        quantity: 36,
        unitPrice: 7.85,
        confidence: "high",
        rawText: null,
      },
      {
        itemCode: "ASDP61",
        productDescription: "Chill Pills",
        variant: "Bottle",
        quantity: 18,
        unitPrice: 7.85,
        confidence: "high",
        rawText: null,
      },
      {
        itemCode: null,
        productDescription: "Badge (design unclear)",
        variant: "Unclear",
        quantity: 10,
        unitPrice: 7.85,
        confidence: "low",
        rawText: "10 bge - ??",
      },
    ],
  },
};
