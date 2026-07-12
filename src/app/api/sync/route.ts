import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db, isDatabaseConfigured } from "@/db";
import { integrations } from "@/db/schema";
import { runSync } from "@/lib/sync/sync-service";
import type { DocumentIntegrationProvider } from "@/lib/sync/provider-registry";

/** Trigger a manual sync for a connected integration (defaults to Google Drive). */
export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { configured: false, message: "DATABASE_URL is not set." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}) as { provider?: string });
  const provider = (body.provider ?? "google_drive") as DocumentIntegrationProvider;

  const integration = await db.query.integrations.findFirst({
    where: eq(integrations.provider, provider),
  });
  if (!integration) {
    return NextResponse.json({ error: `No "${provider}" integration is connected yet.` }, { status: 404 });
  }

  try {
    const summary = await runSync(integration.id, "manual");
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Recent sync job history, newest first — powers a future "Sync Logs" panel. */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, jobs: [] });
  }

  const jobs = await db.query.syncJobs.findMany({
    orderBy: (job, { desc }) => [desc(job.startedAt)],
    limit: 20,
  });
  return NextResponse.json({ configured: true, jobs });
}
