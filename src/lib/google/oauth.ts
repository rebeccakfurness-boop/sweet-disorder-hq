import { google } from "googleapis";

import { googleConfig, isGoogleDriveConfigured } from "./config";
import type { TokenSet } from "@/lib/sync/provider";

function assertConfigured(): void {
  if (!isGoogleDriveConfigured()) {
    throw new Error(
      "Google OAuth is not configured — set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI."
    );
  }
}

export function createOAuthClient() {
  assertConfigured();
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirectUri
  );
}

export function getGoogleAuthUrl(state: string): string {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // forces a refresh_token even on repeat consent
    scope: googleConfig.scopes,
    state,
  });
}

export async function exchangeCodeForTokens(code: string): Promise<TokenSet> {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.access_token) {
    throw new Error("Google did not return an access token for this authorization code.");
  }
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? undefined,
    tokenType: tokens.token_type ?? "Bearer",
    scope: tokens.scope,
    expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
  };
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<TokenSet> {
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  if (!credentials.access_token) {
    throw new Error("Google did not return a refreshed access token.");
  }
  return {
    accessToken: credentials.access_token,
    refreshToken: credentials.refresh_token ?? refreshToken,
    tokenType: credentials.token_type ?? "Bearer",
    scope: credentials.scope,
    expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
  };
}

/** Used right after connecting, purely so the Integrations page can show
 * "Connected as molly@sweetdisorder.co.nz" instead of a bare "Connected". */
export async function getGoogleAccountEmail(accessToken: string): Promise<string | undefined> {
  const client = createOAuthClient();
  client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();
  return data.email ?? undefined;
}
