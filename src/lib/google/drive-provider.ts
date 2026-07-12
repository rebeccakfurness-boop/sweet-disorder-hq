import type { drive_v3 } from "googleapis";

import { createDriveClient, DRIVE_FILE_FIELDS } from "./drive-client";
import { mapDriveFileToProviderFile } from "./mappers";
import { getGoogleAuthUrl, exchangeCodeForTokens, refreshGoogleAccessToken } from "./oauth";
import type {
  DocumentProviderService,
  ProviderChangesResult,
  ProviderFile,
  ProviderFolderTree,
  TokenSet,
} from "@/lib/sync/provider";

/**
 * Google Drive implementation of `DocumentProviderService`. Everything
 * outside `src/lib/google` talks to the interface, not this class directly —
 * see `src/lib/sync/provider.ts` for the contract this fulfils.
 */
export class GoogleDriveProvider implements DocumentProviderService {
  readonly provider = "google_drive";

  constructor(private accessToken?: string) {}

  private driveClient() {
    if (!this.accessToken) {
      throw new Error("GoogleDriveProvider requires an access token to call the Drive API.");
    }
    return createDriveClient(this.accessToken);
  }

  getAuthUrl(state: string): string {
    return getGoogleAuthUrl(state);
  }

  exchangeCodeForTokens(code: string): Promise<TokenSet> {
    return exchangeCodeForTokens(code);
  }

  refreshAccessToken(refreshToken: string): Promise<TokenSet> {
    return refreshGoogleAccessToken(refreshToken);
  }

  /**
   * Recursively lists every folder and file under `rootExternalId` via
   * breadth-first traversal. Used for the very first sync of an integration,
   * where there's no change cursor to resume from yet.
   */
  async listFolderTree(rootExternalId: string): Promise<ProviderFolderTree> {
    const drive = this.driveClient();
    const folders: ProviderFile[] = [];
    const files: ProviderFile[] = [];
    const queue: string[] = [rootExternalId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const folderId = queue.shift();
      if (!folderId || visited.has(folderId)) continue;
      visited.add(folderId);

      let pageToken: string | undefined;
      do {
        const res = await drive.files.list({
          q: `'${folderId}' in parents and trashed = false`,
          fields: `nextPageToken, files(${DRIVE_FILE_FIELDS})`,
          pageSize: 1000,
          pageToken,
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
        });

        for (const rawFile of res.data.files ?? []) {
          const mapped = mapDriveFileToProviderFile(rawFile);
          if (mapped.isFolder) {
            folders.push(mapped);
            queue.push(mapped.externalId);
          } else {
            files.push(mapped);
          }
        }

        pageToken = res.data.nextPageToken ?? undefined;
      } while (pageToken);
    }

    return { folders, files };
  }

  /** A cursor marking "now" — call once right after a full sync completes. */
  async getStartCursor(): Promise<string> {
    const drive = this.driveClient();
    const res = await drive.changes.getStartPageToken({});
    if (!res.data.startPageToken) {
      throw new Error("Google did not return a start page token.");
    }
    return res.data.startPageToken;
  }

  /**
   * Drains Drive's Changes API from `cursor` to "now" and returns every
   * change. Note: Drive's Changes feed is account-wide, not scoped to our
   * root folder — the caller (`sync-service.ts`) is responsible for
   * filtering to changes that are actually inside the synced subtree (by
   * checking against the folders/documents already tracked for this
   * integration) before writing anything.
   */
  async listChanges(cursor: string): Promise<ProviderChangesResult> {
    const drive = this.driveClient();
    const changes: ProviderChangesResult["changes"] = [];
    let pageToken: string | undefined = cursor;
    let newStartPageToken: string | undefined;

    do {
      const res: { data: drive_v3.Schema$ChangeList } = await drive.changes.list({
        pageToken,
        fields: `nextPageToken, newStartPageToken, changes(fileId, removed, file(${DRIVE_FILE_FIELDS}))`,
        pageSize: 1000,
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      });

      for (const change of res.data.changes ?? []) {
        changes.push({
          externalId: change.fileId ?? "",
          removed: Boolean(change.removed) || Boolean(change.file?.trashed),
          file: change.file ? mapDriveFileToProviderFile(change.file) : null,
        });
      }

      pageToken = res.data.nextPageToken ?? undefined;
      if (res.data.newStartPageToken) newStartPageToken = res.data.newStartPageToken;
    } while (pageToken);

    return { changes, nextCursor: newStartPageToken ?? cursor, hasMore: false };
  }
}
