import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db, isDatabaseConfigured } from "@/db";
import { integrations, oauthTokens } from "@/db/schema";
import { refreshGoogleAccessToken } from "@/lib/google/oauth";
import { syncSupplierRecordsFromSheet } from "@/lib/supplier-records/sync";

/**
 * Trigger a manual pull from the connected Sheet. `integrations.rootResourceId`
 * holds the spreadsheet ID for the "google_sheets" integration — set it once
 * (env var default below, or later a picker in Integrations) and every
 * subsequent sync just re-reads the same two tabs.
 */
export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, message: "DATABASE_URL is not set." }, { status: 503 });
  }

  const integration = await db.query.integrations.findFirst({
    where: eq(integrations.provider, "google_sheets"),
  });
  if (!integration) {
    return NextResponse.json(
      { error: "Google Sheets isn't connected yet — connect Google from Integrations first." },
      { status: 404 }
    );
  }

  const spreadsheetId = integration.rootResourceId ?? process.env.GOOGLE_SHEETS_SUPPLIER_RECORDS_ID;
  if (!spreadsheetId) {
    return NextResponse.json(
      { error: "No spreadsheet ID set — set GOOGLE_SHEETS_SUPPLIER_RECORDS_ID or select a sheet in Integrations." },
      { status: 400 }
    );
  }

  const token = await db.query.oauthTokens.findFirst({
    where: eq(oauthTokens.integrationId, integration.id),
  });
  if (!token) {
    return NextResponse.json({ error: "No stored Google credentials — connect it first." }, { status: 404 });
  }

  let accessToken = token.accessToken;
  if (token.refreshToken && token.expiresAt && token.expiresAt.getTime() < Date.now() + 60_000) {
    const refreshed = await refreshGoogleAccessToken(token.refreshToken);
    accessToken = refreshed.accessToken;
    await db
      .update(oauthTokens)
      .set({ accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt, updatedAt: new Date() })
      .where(eq(oauthTokens.integrationId, integration.id));
  }

  try {
    const summary = await syncSupplierRecordsFromSheet(integration.id, accessToken, spreadsheetId);
    await db
      .update(integrations)
      .set({
        rootResourceId: spreadsheetId,
        status: "connected",
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, integration.id));
    return NextResponse.json({ configured: true, ...summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    await db
      .update(integrations)
      .set({ status: "error", updatedAt: new Date() })
      .where(eq(integrations.id, integration.id));
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
