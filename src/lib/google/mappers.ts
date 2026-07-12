import type { drive_v3 } from "googleapis";

import type { ProviderFile } from "@/lib/sync/provider";

const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

export function mapDriveFileToProviderFile(file: drive_v3.Schema$File): ProviderFile {
  return {
    externalId: file.id ?? "",
    name: file.name ?? "Untitled",
    mimeType: file.mimeType ?? "application/octet-stream",
    isFolder: file.mimeType === FOLDER_MIME_TYPE,
    parentExternalId: file.parents?.[0] ?? null,
    url: file.webViewLink ?? null,
    iconUrl: file.iconLink ?? null,
    ownerName: file.owners?.[0]?.displayName ?? null,
    ownerEmail: file.owners?.[0]?.emailAddress ?? null,
    version: file.version ?? null,
    checksum: file.md5Checksum ?? null,
    createdAt: file.createdTime ? new Date(file.createdTime) : null,
    modifiedAt: file.modifiedTime ? new Date(file.modifiedTime) : null,
    trashed: file.trashed ?? false,
  };
}
