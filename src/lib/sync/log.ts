import { eq } from "drizzle-orm";

import { db } from "@/db";
import { syncJobs, syncJobEvents } from "@/db/schema";
import type { SyncAction, SyncJobStatus, SyncTrigger } from "./types";

export async function startSyncJob(
  integrationId: string,
  trigger: SyncTrigger,
  cursorBefore: string | null
) {
  const [job] = await db
    .insert(syncJobs)
    .values({ integrationId, trigger, cursorBefore, status: "running" })
    .returning();
  return job;
}

export async function logSyncEvent(
  syncJobId: string,
  action: SyncAction,
  documentExternalId?: string,
  message?: string
) {
  await db.insert(syncJobEvents).values({ syncJobId, action, documentExternalId, message });
}

export interface SyncJobCompletion {
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

export async function completeSyncJob(syncJobId: string, result: SyncJobCompletion) {
  await db
    .update(syncJobs)
    .set({ ...result, completedAt: new Date() })
    .where(eq(syncJobs.id, syncJobId));
}
