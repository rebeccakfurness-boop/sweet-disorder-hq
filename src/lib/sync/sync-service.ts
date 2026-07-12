import { eq } from "drizzle-orm";

import { db } from "@/db";
import { integrations, oauthTokens, documentFolders, documents } from "@/db/schema";
import { buildFolderPathIndex } from "@/lib/knowledge/categories";
import { mapMimeTypeToFileType } from "@/lib/knowledge/file-types";
import { diffFiles } from "./diff";
import { startSyncJob, completeSyncJob, logSyncEvent } from "./log";
import { createProvider, type DocumentIntegrationProvider } from "./provider-registry";
import type { ProviderFile } from "./provider";
import type { SyncRunSummary, SyncTrigger } from "./types";

/**
 * Runs one sync for `integrationId` — full sync if it has never synced
 * before (no cursor yet), incremental otherwise. This is the one place that
 * turns "files a provider reports" into "rows in our database"; API routes
 * and the (future) scheduler both just call this.
 */
export async function runSync(integrationId: string, trigger: SyncTrigger): Promise<SyncRunSummary> {
  const integration = await db.query.integrations.findFirst({
    where: eq(integrations.id, integrationId),
  });
  if (!integration) {
    throw new Error(`Integration ${integrationId} not found`);
  }
  if (!integration.rootResourceId) {
    throw new Error("This integration has no root folder selected yet — pick a Drive folder first.");
  }

  const token = await db.query.oauthTokens.findFirst({
    where: eq(oauthTokens.integrationId, integrationId),
  });
  if (!token) {
    throw new Error(`Integration ${integrationId} has no stored credentials — connect it first.`);
  }

  const provider = createProvider(integration.provider as DocumentIntegrationProvider, token.accessToken);

  // Refresh proactively if the access token is expired or about to be.
  let accessToken = token.accessToken;
  if (token.refreshToken && token.expiresAt && token.expiresAt.getTime() < Date.now() + 60_000) {
    const refreshed = await provider.refreshAccessToken(token.refreshToken);
    accessToken = refreshed.accessToken;
    await db
      .update(oauthTokens)
      .set({ accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt, updatedAt: new Date() })
      .where(eq(oauthTokens.integrationId, integrationId));
  }
  const activeProvider = createProvider(integration.provider as DocumentIntegrationProvider, accessToken);

  const job = await startSyncJob(integrationId, trigger, integration.cursor);

  try {
    const isFirstSync = !integration.cursor;

    let incomingFolders: ProviderFile[];
    let incomingDocs: ProviderFile[];
    let nextCursor: string;

    const existingFolders = await db.query.documentFolders.findMany({
      where: eq(documentFolders.integrationId, integrationId),
    });
    const existingDocs = await db.query.documents.findMany({
      where: eq(documents.integrationId, integrationId),
    });

    if (isFirstSync) {
      const tree = await activeProvider.listFolderTree(integration.rootResourceId);
      incomingFolders = tree.folders;
      incomingDocs = tree.files;
      nextCursor = await activeProvider.getStartCursor();
    } else {
      // Drive's Changes API is account-wide, so narrow to files we already
      // track (updates/moves/deletes) or that just appeared inside a folder
      // we already track (new files). A file created deep inside a
      // brand-new, not-yet-tracked subfolder in the same run is the one gap
      // here — closed the moment that subfolder itself gets picked up.
      const trackedFolderIds = new Set(existingFolders.map((f) => f.externalId));
      const trackedDocIds = new Set(existingDocs.map((d) => d.externalId));

      const result = await activeProvider.listChanges(integration.cursor!);
      nextCursor = result.nextCursor;

      const relevant = result.changes.filter((change) => {
        if (trackedDocIds.has(change.externalId) || trackedFolderIds.has(change.externalId)) return true;
        return Boolean(
          change.file?.parentExternalId && trackedFolderIds.has(change.file.parentExternalId)
        );
      });

      incomingFolders = relevant.filter((c) => c.file?.isFolder).map((c) => c.file!);
      incomingDocs = relevant.filter((c) => c.file && !c.file.isFolder).map((c) => c.file!);

      for (const change of result.changes.filter((c) => c.removed)) {
        if (trackedDocIds.has(change.externalId)) {
          const row = existingDocs.find((d) => d.externalId === change.externalId);
          if (row && !row.deletedAt) {
            await db
              .update(documents)
              .set({ syncStatus: "deleted", deletedAt: new Date() })
              .where(eq(documents.id, row.id));
            await logSyncEvent(job.id, "deleted", change.externalId, `"${row.name}" removed from Drive`);
          }
        }
      }
    }

    // Folders never track a content version in our schema — strip
    // version/checksum before diffing so a folder is only ever flagged as
    // moved/renamed, never a false "content changed".
    const folderDiff = diffFiles(
      incomingFolders.map((f) => ({ ...f, version: null, checksum: null })),
      existingFolders.map((f) => ({
        id: f.id,
        externalId: f.externalId,
        name: f.name,
        parentExternalId: f.parentExternalId,
        version: null,
        checksum: null,
        deletedAt: null,
      }))
    );

    const externalIdToFolderId = new Map(existingFolders.map((f) => [f.externalId, f.id]));

    for (const file of folderDiff.toCreate) {
      const [row] = await db
        .insert(documentFolders)
        .values({
          integrationId,
          externalId: file.externalId,
          parentExternalId: file.parentExternalId,
          name: file.name,
          category: "uncategorized",
        })
        .returning();
      externalIdToFolderId.set(file.externalId, row.id);
      await logSyncEvent(job.id, "created", file.externalId, `Folder "${file.name}" created`);
    }

    for (const { existing, incoming, action } of folderDiff.toUpdate) {
      await db
        .update(documentFolders)
        .set({ name: incoming.name, parentExternalId: incoming.parentExternalId, updatedAt: new Date() })
        .where(eq(documentFolders.id, existing.id));
      await logSyncEvent(job.id, action, incoming.externalId, `Folder "${incoming.name}" ${action}`);
    }

    for (const existing of folderDiff.toDelete) {
      await db.delete(documentFolders).where(eq(documentFolders.id, existing.id));
      await logSyncEvent(job.id, "deleted", existing.externalId, `Folder "${existing.name}" removed`);
    }

    // Recompute category + path for every known folder now that this run's
    // creates/renames/moves have landed — cheap in practice (dozens of
    // folders, not thousands) and avoids incremental path-math bugs.
    const allFolders = await db.query.documentFolders.findMany({
      where: eq(documentFolders.integrationId, integrationId),
    });
    const pathIndex = buildFolderPathIndex(allFolders, integration.rootResourceId);
    for (const folder of allFolders) {
      const resolution = pathIndex.get(folder.externalId);
      if (resolution && (resolution.path !== folder.path || resolution.category !== folder.category)) {
        await db
          .update(documentFolders)
          .set({ path: resolution.path, category: resolution.category, updatedAt: new Date() })
          .where(eq(documentFolders.id, folder.id));
      }
    }

    const docDiff = diffFiles(
      incomingDocs,
      existingDocs.map((d) => ({
        id: d.id,
        externalId: d.externalId,
        name: d.name,
        parentExternalId: d.parentExternalId,
        version: d.version,
        checksum: d.checksum,
        deletedAt: d.deletedAt,
      }))
    );

    const resolveDocFields = (file: ProviderFile) => {
      const folderId = file.parentExternalId ? externalIdToFolderId.get(file.parentExternalId) ?? null : null;
      const category = file.parentExternalId
        ? pathIndex.get(file.parentExternalId)?.category ?? "uncategorized"
        : "uncategorized";
      return { folderId, category };
    };

    for (const file of docDiff.toCreate) {
      const { folderId, category } = resolveDocFields(file);
      await db.insert(documents).values({
        integrationId,
        folderId,
        externalId: file.externalId,
        parentExternalId: file.parentExternalId,
        name: file.name,
        category,
        fileType: mapMimeTypeToFileType(file.mimeType),
        mimeType: file.mimeType,
        url: file.url,
        iconUrl: file.iconUrl,
        ownerName: file.ownerName,
        ownerEmail: file.ownerEmail,
        version: file.version,
        checksum: file.checksum,
        syncStatus: "synced",
        externalCreatedAt: file.createdAt,
        externalModifiedAt: file.modifiedAt,
        lastSyncedAt: new Date(),
      });
      await logSyncEvent(job.id, "created", file.externalId, `"${file.name}" added`);
    }

    for (const { existing, incoming, action } of docDiff.toUpdate) {
      const { folderId, category } = resolveDocFields(incoming);
      await db
        .update(documents)
        .set({
          name: incoming.name,
          folderId,
          category,
          parentExternalId: incoming.parentExternalId,
          url: incoming.url,
          iconUrl: incoming.iconUrl,
          version: incoming.version,
          checksum: incoming.checksum,
          externalModifiedAt: incoming.modifiedAt,
          syncStatus: "synced",
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(documents.id, existing.id));
      await logSyncEvent(job.id, action, incoming.externalId, `"${incoming.name}" ${action}`);
    }

    for (const existing of docDiff.toDelete) {
      await db
        .update(documents)
        .set({ syncStatus: "deleted", deletedAt: new Date() })
        .where(eq(documents.id, existing.id));
      await logSyncEvent(job.id, "deleted", existing.externalId, `"${existing.name}" no longer present`);
    }

    await db
      .update(integrations)
      .set({ cursor: nextCursor, lastSyncedAt: new Date(), status: "connected", updatedAt: new Date() })
      .where(eq(integrations.id, integrationId));

    const summary: SyncRunSummary = {
      syncJobId: job.id,
      status: "success",
      cursorAfter: nextCursor,
      filesScanned: incomingFolders.length + incomingDocs.length,
      filesAdded: folderDiff.toCreate.length + docDiff.toCreate.length,
      filesUpdated:
        folderDiff.toUpdate.filter((u) => u.action === "updated").length +
        docDiff.toUpdate.filter((u) => u.action === "updated").length,
      filesDeleted: folderDiff.toDelete.length + docDiff.toDelete.length,
      filesMoved: docDiff.toUpdate.filter((u) => u.action === "moved").length,
      filesRenamed: docDiff.toUpdate.filter((u) => u.action === "renamed").length,
    };

    await completeSyncJob(job.id, summary);
    return summary;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    const failure: SyncRunSummary = {
      syncJobId: job.id,
      status: "failed",
      filesScanned: 0,
      filesAdded: 0,
      filesUpdated: 0,
      filesDeleted: 0,
      filesMoved: 0,
      filesRenamed: 0,
      errorMessage: message,
    };
    await completeSyncJob(job.id, failure);
    return failure;
  }
}
