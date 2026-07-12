// Plain string-union mirrors of the sync-related Postgres enums. Business
// logic (this module, API routes) imports these instead of the Drizzle enum
// objects so `lib/sync` never has to import `drizzle-orm/pg-core` directly.
export type SyncTrigger = "manual" | "scheduled" | "webhook";
export type SyncJobStatus = "running" | "success" | "partial" | "failed";
export type SyncAction = "created" | "updated" | "moved" | "renamed" | "deleted" | "skipped" | "error";

export interface SyncRunSummary {
  syncJobId: string;
  status: SyncJobStatus;
  cursorAfter?: string;
  filesScanned: number;
  filesAdded: number;
  filesUpdated: number;
  filesDeleted: number;
  filesMoved: number;
  filesRenamed: number;
  errorMessage?: string;
}
