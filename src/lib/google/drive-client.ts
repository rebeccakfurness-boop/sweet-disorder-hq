import { google, type drive_v3 } from "googleapis";

import { createOAuthClient } from "./oauth";

export function createDriveClient(accessToken: string): drive_v3.Drive {
  const auth = createOAuthClient();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth });
}

// Fields we actually use, requested explicitly — Drive's default file
// response is minimal, and asking for exactly what `mappers.ts` needs keeps
// list calls cheap.
export const DRIVE_FILE_FIELDS =
  "id, name, mimeType, parents, webViewLink, iconLink, owners(displayName,emailAddress), version, md5Checksum, createdTime, modifiedTime, trashed";
