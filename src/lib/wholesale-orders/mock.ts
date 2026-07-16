// Mock data for the Wholesale Orders photo-upload flow — same pattern as
// src/lib/knowledge/mock.ts and src/lib/supplier-records/mock.ts: there's no
// OCR/AI service wired up yet, so "Read order" (src/components/wholesale-orders
// /upload-form.tsx) simulates one by returning a fixed set of extracted lines
// for the chosen region after a short delay. Swap that simulated delay for a
// real vision/OCR call once one exists — the UI already expects exactly this
// shape back.
import type { WholesaleOrderLine, WholesaleOrderRegion } from "./types";

export const mockWholesaleOrderLinesByRegion: Record<WholesaleOrderRegion, WholesaleOrderLine[]> = {
  NZ: [
    {
      id: "nz-line-1",
      itemCode: "SD-JAR-PINE",
      productDescription: "Pineapple Lump Jar 250ml",
      variant: "Retro Label",
      quantity: 24,
      unitPrice: 8.5,
      confidence: "high",
      rawText: null,
    },
    {
      id: "nz-line-2",
      itemCode: "SD-JAR-CFISH",
      productDescription: "Chocolate Fish Jar 250ml",
      variant: "Retro Label",
      quantity: 24,
      unitPrice: 8.5,
      confidence: "high",
      rawText: null,
    },
    {
      id: "nz-line-3",
      itemCode: "SD-GIFT-CLASSIC",
      productDescription: "Cheeky Gift Box",
      variant: "Classic",
      quantity: 12,
      unitPrice: 22,
      confidence: "high",
      rawText: null,
    },
    {
      id: "nz-line-4",
      itemCode: null,
      productDescription: "Mixed Lolly Jar (assorted)",
      variant: "Unclear",
      quantity: 6,
      unitPrice: 8.5,
      confidence: "low",
      rawText: "6 x mixd loly jars asst",
    },
    {
      id: "nz-line-5",
      itemCode: "SD-GIFT-DELUXE",
      productDescription: "Corporate Gift Set",
      variant: "Deluxe",
      quantity: 4,
      unitPrice: 45,
      confidence: "high",
      rawText: null,
    },
  ],
  AUS: [
    {
      id: "aus-line-1",
      itemCode: "SD-JAR-PINE",
      productDescription: "Pineapple Lump Jar 250ml",
      variant: "Retro Label",
      quantity: 36,
      unitPrice: 9,
      confidence: "high",
      rawText: null,
    },
    {
      id: "aus-line-2",
      itemCode: "SD-JAR-EUCA",
      productDescription: "Eucalyptus Drop Jar 250ml",
      variant: "Retro Label",
      quantity: 18,
      unitPrice: 9,
      confidence: "high",
      rawText: null,
    },
    {
      id: "aus-line-3",
      itemCode: null,
      productDescription: "Gift Box (size unclear)",
      variant: "Unclear",
      quantity: 10,
      unitPrice: 24,
      confidence: "low",
      rawText: "10 gft box - lge??",
    },
    {
      id: "aus-line-4",
      itemCode: "SD-GIFT-CLASSIC",
      productDescription: "Cheeky Gift Box",
      variant: "Classic",
      quantity: 15,
      unitPrice: 24,
      confidence: "high",
      rawText: null,
    },
  ],
};
