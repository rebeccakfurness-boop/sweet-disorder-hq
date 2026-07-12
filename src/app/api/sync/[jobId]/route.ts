import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db, isDatabaseConfigured } from "@/db";
import { syncJobs, syncJobEvents } from "@/db/schema";

/** A single sync job plus its full per-file event log. */
export async function GET(_request: Request, { params }: { params: { jobId: string } }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  const job = await db.query.syncJobs.findFirst({ where: eq(syncJobs.id, params.jobId) });
  if (!job) {
    return NextResponse.json({ error: "Sync job not found" }, { status: 404 });
  }

  const events = await db.query.syncJobEvents.findMany({
    where: eq(syncJobEvents.syncJobId, params.jobId),
    orderBy: (event, { asc }) => [asc(event.createdAt)],
  });

  return NextResponse.json({ configured: true, job, events });
}
