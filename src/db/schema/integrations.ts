import { pgTable, pgEnum, uuid, text, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Every external system Project HQ can connect to lives under one
// `integration_provider` value. Adding Shopify/Xero/Gmail later means adding
// an enum value here plus a provider implementation under `src/lib/<provider>`
// — nothing else in this table changes.
export const integrationProviderEnum = pgEnum("integration_provider", [
  "google_drive",
  "google_sheets",
  "shopify",
  "xero",
  "hubspot",
  "gmail",
  "oki_printer",
]);

export const integrationStatusEnum = pgEnum("integration_status", [
  "not_connected",
  "connected",
  "error",
  "revoked",
]);

// One row per connected external account. Kept provider-agnostic on purpose:
// `rootResourceId` is "the folder/store/org this integration is scoped to"
// and `cursor` is "wherever the provider's incremental-sync bookmark is" —
// both are opaque strings so a Dropbox or SharePoint provider can reuse the
// same table without a migration.
export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: integrationProviderEnum("provider").notNull(),
    status: integrationStatusEnum("status").default("not_connected").notNull(),
    accountEmail: text("account_email"),
    accountLabel: text("account_label"),
    externalAccountId: text("external_account_id"),
    rootResourceId: text("root_resource_id"),
    cursor: text("cursor"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    providerIdx: uniqueIndex("integrations_provider_idx").on(table.provider),
  })
);

// Tokens are split out from `integrations` so refreshing a token never
// touches connection metadata, and so a future multi-account setup only
// needs to drop the unique constraint below, not restructure the table.
export const oauthTokens = pgTable(
  "oauth_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id")
      .references(() => integrations.id, { onDelete: "cascade" })
      .notNull(),
    // TODO: encrypt access/refresh tokens at rest (e.g. via pgcrypto or an
    // application-layer KMS) before this holds real credentials.
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    tokenType: text("token_type").default("Bearer").notNull(),
    scope: text("scope"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    integrationIdx: uniqueIndex("oauth_tokens_integration_idx").on(table.integrationId),
  })
);

export const integrationsRelations = relations(integrations, ({ one }) => ({
  token: one(oauthTokens, {
    fields: [integrations.id],
    references: [oauthTokens.integrationId],
  }),
}));

export const oauthTokensRelations = relations(oauthTokens, ({ one }) => ({
  integration: one(integrations, {
    fields: [oauthTokens.integrationId],
    references: [integrations.id],
  }),
}));
