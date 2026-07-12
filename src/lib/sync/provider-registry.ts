import { GoogleDriveProvider } from "@/lib/google/drive-provider";
import type { DocumentProviderService } from "./provider";

// Every provider `lib/sync` knows how to build. Adding SharePoint/Dropbox/
// OneDrive later is: write the class under `src/lib/<provider>`, add one
// line here, add the enum value in `db/schema/integrations.ts`. Nothing else
// in `lib/sync` changes.
export type DocumentIntegrationProvider = "google_drive";

export function createProvider(
  provider: DocumentIntegrationProvider,
  accessToken?: string
): DocumentProviderService {
  switch (provider) {
    case "google_drive":
      return new GoogleDriveProvider(accessToken);
    default: {
      const exhaustiveCheck: never = provider;
      throw new Error(`No provider implementation registered for "${exhaustiveCheck}"`);
    }
  }
}
