import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db, isDatabaseConfigured } from "@/db";
import { integrations } from "@/db/schema";
import { isGoogleDriveConfigured } from "@/lib/google/config";

export async function GET() {
  if (!isGoogleDriveConfigured()) {
    return NextResponse.json({ configured: false, connected: false });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      configured: true,
      connected: false,
      message: "Google OAuth is configured, but DATABASE_URL is not set yet.",
    });
  }

  const integration = await db.query.integrations.findFirst({
    where: eq(integrations.provider, "google_drive"),
  });

  return NextResponse.json({
    configured: true,
    connected: integration?.status === "connected",
    accountEmail: integration?.accountEmail ?? null,
    rootResourceId: integration?.rootResourceId ?? null,
    lastSyncedAt: integration?.lastSyncedAt ?? null,
  });
}
