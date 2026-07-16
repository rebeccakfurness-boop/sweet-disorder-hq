import { NextRequest, NextResponse } from "next/server";

import { db, isDatabaseConfigured } from "@/db";
import { integrations, oauthTokens } from "@/db/schema";
import { exchangeCodeForTokens, getGoogleAccountEmail } from "@/lib/google/oauth";

const STATE_COOKIE = "google_oauth_state";

/** Step 2: Google redirects here with `code` + `state` after the user grants access. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code from Google." }, { status: 400 });
  }
  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json(
      { error: "OAuth state mismatch — please restart the connection from Integrations." },
      { status: 400 }
    );
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        message: "DATABASE_URL is not set — connect a database before completing Google sign-in.",
      },
      { status: 503 }
    );
  }

  const tokens = await exchangeCodeForTokens(code);
  const accountEmail = await getGoogleAccountEmail(tokens.accessToken).catch(() => undefined);

  // One consent screen grants both the Drive and Sheets scopes (see
  // src/lib/google/config.ts), so this single token set powers both the
  // Knowledge Hub and Supplier Records — write an integration row for each.
  for (const provider of ["google_drive", "google_sheets"] as const) {
    const [integration] = await db
      .insert(integrations)
      .values({ provider, status: "connected", accountEmail })
      .onConflictDoUpdate({
        target: integrations.provider,
        set: { status: "connected", accountEmail, updatedAt: new Date() },
      })
      .returning();

    await db
      .insert(oauthTokens)
      .values({
        integrationId: integration.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType ?? "Bearer",
        scope: tokens.scope,
        expiresAt: tokens.expiresAt,
      })
      .onConflictDoUpdate({
        target: oauthTokens.integrationId,
        set: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: tokens.expiresAt,
          updatedAt: new Date(),
        },
      });
  }

  const response = NextResponse.redirect(new URL("/settings/integrations?connected=google_drive", request.url));
  response.cookies.delete(STATE_COOKIE);
  return response;
}
