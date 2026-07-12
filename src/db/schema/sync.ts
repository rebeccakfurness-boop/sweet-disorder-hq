import { pgTable, pgEnum, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { integrations } from "./integrations";

export const syncTriggerEnum = pgEnum("sync_trigger", ["manual", "scheduled", "webhook"]);

export const syncJobStatusEnum = pgEnum("sync_job_status", [
  "running",
  "success",
  "partial",
  "failed",
]);

export const syncActionEnum = pgEnum("sync_action", [
  "created",
  "updated",
  "moved",
  "renamed",
  "deleted",
  "skipped",
  "error",
]);

// One row per sync run, for any integration/provider. `cursorBefore` /
// `cursorAfter` capture the provider's incremental-sync bookmark
// (e.g. Google Drive's `startPageToken`) so a failed run can be retried from
// where it left off instead of re-scanning everything.
export const syncJobs = pgTable("sync_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  integrationId: uuid("integration_id")
    .references(() => integrations.id, { onDelete: "cascade" })
    .notNull(),
  trigger: syncTriggerEnum("trigger").notNull(),
  status: syncJobStatusEnum("status").default("running").notNull(),
  cursorBefore: text("cursor_before"),
  cursorAfter: text("cursor_after"),
  filesScanned: integer("files_scanned").default(0).notNull(),
  filesAdded: integer("files_added").default(0).notNull(),
  filesUpdated: integer("files_updated").default(0).notNull(),
  filesDeleted: integer("files_deleted").default(0).notNull(),
  filesMoved: integer("files_moved").default(0).notNull(),
  filesRenamed: integer("files_renamed").default(0).notNull(),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// Per-file audit trail for a sync run — what happened to a specific file and
// why, so "why did this document disappear from the Knowledge Hub" always
// has an answer.
export const syncJobEvents = pgTable("sync_job_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  syncJobId: uuid("sync_job_id")
    .references(() => syncJobs.id, { onDelete: "cascade" })
    .notNull(),
  documentExternalId: text("document_external_id"),
  action: syncActionEnum("action").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const syncJobsRelations = relations(syncJobs, ({ one, many }) => ({
  integration: one(integrations, {
    fields: [syncJobs.integrationId],
    references: [integrations.id],
  }),
  events: many(syncJobEvents),
}));

export const syncJobEventsRelations = relations(syncJobEvents, ({ one }) => ({
  syncJob: one(syncJobs, { fields: [syncJobEvents.syncJobId], references: [syncJobs.id] }),
}));
