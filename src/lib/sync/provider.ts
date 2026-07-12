/**
 * The contract every file-storage integration implements. `src/lib/sync`
 * only ever talks to this interface — it has no idea Google Drive exists.
 * Adding SharePoint, Dropbox, or OneDrive later means writing one new class
 * under `src/lib/<provider>` that implements `DocumentProviderService`, then
 * registering it in `provider-registry.ts`. Nothing under `lib/sync` or
 * `lib/knowledge` changes.
 */

export interface ProviderFile {
  /** The provider's own id for this file/folder (e.g. Google Drive's `id`). */
  externalId: string;
  name: string;
  mimeType: string;
  isFolder: boolean;
  parentExternalId: string | null;
  url: string | null;
  iconUrl: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  /** Provider revision marker (Drive's `version`) — cheap change detection. */
  version: string | null;
  /** Content checksum (Drive's `md5Checksum`) — null for Docs/Sheets/folders. */
  checksum: string | null;
  createdAt: Date | null;
  modifiedAt: Date | null;
  trashed: boolean;
}

export interface ProviderChange {
  externalId: string;
  /** True when the provider reports this file deleted or trashed. */
  removed: boolean;
  file: ProviderFile | null;
}

export interface ProviderChangesResult {
  changes: ProviderChange[];
  /** Opaque cursor to resume from on the next incremental sync. */
  nextCursor: string;
  hasMore: boolean;
}

export interface ProviderFolderTree {
  folders: ProviderFile[];
  files: ProviderFile[];
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  scope?: string;
  expiresAt?: Date;
}

export interface DocumentProviderService {
  readonly provider: string;

  /** Step 1 of OAuth: where to send the user to grant access. */
  getAuthUrl(state: string): string;

  /** Step 2 of OAuth: exchange the redirect `code` for tokens. */
  exchangeCodeForTokens(code: string): Promise<TokenSet>;

  refreshAccessToken(refreshToken: string): Promise<TokenSet>;

  /** Full recursive listing under a root folder — used for the first sync. */
  listFolderTree(rootExternalId: string): Promise<ProviderFolderTree>;

  /** A cursor marking "now", to start incremental sync from after a full sync. */
  getStartCursor(): Promise<string>;

  /** Everything that changed since `cursor` (created/updated/moved/deleted). */
  listChanges(cursor: string): Promise<ProviderChangesResult>;
}
