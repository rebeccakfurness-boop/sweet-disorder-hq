import type { ProviderFile } from "./provider";
import type { SyncAction } from "./types";

/**
 * Pure, provider-agnostic diffing. Takes the current file list from a
 * provider and the rows already in the database, and works out what to do —
 * no I/O, so it's trivially unit-testable and reused by both the full-sync
 * and incremental-sync paths in `sync-service.ts`.
 */
export interface ExistingRecord {
  id: string;
  externalId: string;
  name: string;
  parentExternalId: string | null;
  version: string | null;
  checksum: string | null;
  deletedAt: Date | null;
}

export interface DiffUpdate<T extends ExistingRecord> {
  existing: T;
  incoming: ProviderFile;
  action: Extract<SyncAction, "updated" | "moved" | "renamed">;
}

export interface DiffOutcome<T extends ExistingRecord> {
  toCreate: ProviderFile[];
  toUpdate: DiffUpdate<T>[];
  toDelete: T[];
  unchanged: T[];
}

export function diffFiles<T extends ExistingRecord>(
  incomingFiles: ProviderFile[],
  existingRecords: T[]
): DiffOutcome<T> {
  const existingByExternalId = new Map(existingRecords.map((record) => [record.externalId, record]));
  const incomingIds = new Set(incomingFiles.map((file) => file.externalId));

  const toCreate: ProviderFile[] = [];
  const toUpdate: DiffUpdate<T>[] = [];
  const unchanged: T[] = [];

  for (const file of incomingFiles) {
    if (file.trashed) continue;

    const existing = existingByExternalId.get(file.externalId);
    if (!existing || existing.deletedAt) {
      toCreate.push(file);
      continue;
    }

    const renamed = existing.name !== file.name;
    const moved = existing.parentExternalId !== file.parentExternalId;
    const contentChanged = existing.checksum !== file.checksum || existing.version !== file.version;

    if (moved) {
      toUpdate.push({ existing, incoming: file, action: "moved" });
    } else if (renamed) {
      toUpdate.push({ existing, incoming: file, action: "renamed" });
    } else if (contentChanged) {
      toUpdate.push({ existing, incoming: file, action: "updated" });
    } else {
      unchanged.push(existing);
    }
  }

  const toDelete = existingRecords.filter(
    (record) => !record.deletedAt && !incomingIds.has(record.externalId)
  );

  return { toCreate, toUpdate, toDelete, unchanged };
}
