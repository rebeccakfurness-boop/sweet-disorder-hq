import { pgTable, pgEnum, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// A wholesale order staged from a photographed paper order form (see
// src/lib/wholesale-orders/read-order.ts) — one row per photo read, sitting
// in "pending_review" until a human checks the AI's extraction and approves
// it. Kept independent of the lib/wholesale-orders/types.ts domain types
// (same pattern as documents/documentFolders in knowledge.ts) so this file
// never needs to import from lib/ — src/lib/wholesale-orders/repository.ts
// is the one place that maps between the two shapes.
export const wholesaleOrderRegionEnum = pgEnum("wholesale_order_region", ["NZ", "AUS"]);

export const wholesaleOrderStatusEnum = pgEnum("wholesale_order_status", [
  "pending_review",
  "approved",
  "sent_to_xero",
  "error",
]);

interface WholesaleOrderLineRow {
  itemCode: string | null;
  productDescription: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  confidence: "high" | "low";
  rawText: string | null;
}

export const wholesaleOrders = pgTable("wholesale_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  region: wholesaleOrderRegionEnum("region").notNull(),
  // Not populated yet — there's no blob storage wired up to persist the
  // uploaded photo itself, only the AI's reading of it. Reserved for when
  // one exists (Vercel Blob, S3, etc).
  photoUrl: text("photo_url"),
  storeName: text("store_name"),
  contactPerson: text("contact_person"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  // Kept as free text, not a real `date` column — it's read off handwriting
  // and may not parse cleanly (see orderRequiredDate in the extraction
  // prompt), same reasoning as sourceUpdatedAt in supplier-records.ts.
  orderRequiredDate: text("order_required_date"),
  additionalNotes: text("additional_notes"),
  lineItems: jsonb("line_items").$type<WholesaleOrderLineRow[]>().notNull().default([]),
  status: wholesaleOrderStatusEnum("status").default("pending_review").notNull(),
  xeroQuoteId: text("xero_quote_id"),
  xeroQuoteUrl: text("xero_quote_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  // No real auth yet (see src/db/schema/auth.ts) — free text until a signed-in
  // reviewer's identity exists to populate this automatically.
  reviewedBy: text("reviewed_by"),
});
