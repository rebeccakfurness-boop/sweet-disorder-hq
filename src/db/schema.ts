import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  numeric,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const companyTypeEnum = pgEnum("company_type", [
  "corporate",
  "wholesale",
  "retail_stockist",
]);

export const opportunityStageEnum = pgEnum("opportunity_stage", [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "draft",
  "sent",
  "accepted",
  "declined",
]);

export const productionStatusEnum = pgEnum("production_status", [
  "not_started",
  "in_progress",
  "qc_check",
  "ready_to_dispatch",
]);

export const supplierComplianceEnum = pgEnum("supplier_compliance", [
  "compliant",
  "needs_update",
]);

// ---------------------------------------------------------------------------
// Companies & contacts
// ---------------------------------------------------------------------------

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: companyTypeEnum("type").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull().default("New Zealand"),
  website: text("website"),
  notes: text("notes"),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  title: text("title"),
  email: text("email"),
  phone: text("phone"),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Pipeline: opportunities & quotes
// ---------------------------------------------------------------------------

export const opportunities = pgTable("opportunities", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  stage: opportunityStageEnum("stage").default("new").notNull(),
  estimatedValue: numeric("estimated_value", { precision: 10, scale: 2 }).notNull(),
  nextFollowUpDate: date("next_follow_up_date"),
  ownerName: text("owner_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sku: text("sku"),
  description: text("description"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull().default("18.00"),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteNumber: text("quote_number").notNull(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, {
    onDelete: "set null",
  }),
  status: quoteStatusEnum("status").default("draft").notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).default("0").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  validUntil: date("valid_until"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quoteLineItems = pgTable("quote_line_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  quoteId: uuid("quote_id")
    .references(() => quotes.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

// ---------------------------------------------------------------------------
// Production & suppliers
// ---------------------------------------------------------------------------

export const productionJobs = pgTable("production_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, {
    onDelete: "set null",
  }),
  companyName: text("company_name").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  status: productionStatusEnum("status").default("not_started").notNull(),
  batchCode: text("batch_code").notNull(),
  bestBeforeDate: date("best_before_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  lastOrderDate: date("last_order_date"),
  complianceStatus: supplierComplianceEnum("compliance_status").default("compliant").notNull(),
});

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  dueDate: date("due_date"),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const companiesRelations = relations(companies, ({ many }) => ({
  contacts: many(contacts),
  opportunities: many(opportunities),
  quotes: many(quotes),
  tasks: many(tasks),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  company: one(companies, { fields: [contacts.companyId], references: [companies.id] }),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  company: one(companies, { fields: [opportunities.companyId], references: [companies.id] }),
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, { fields: [quotes.companyId], references: [companies.id] }),
  opportunity: one(opportunities, {
    fields: [quotes.opportunityId],
    references: [opportunities.id],
  }),
  lineItems: many(quoteLineItems),
}));

export const quoteLineItemsRelations = relations(quoteLineItems, ({ one }) => ({
  quote: one(quotes, { fields: [quoteLineItems.quoteId], references: [quotes.id] }),
  product: one(products, { fields: [quoteLineItems.productId], references: [products.id] }),
}));

export const productionJobsRelations = relations(productionJobs, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [productionJobs.opportunityId],
    references: [opportunities.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  company: one(companies, { fields: [tasks.companyId], references: [companies.id] }),
}));
