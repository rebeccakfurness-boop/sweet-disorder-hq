import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { mockStaffTrainingProgress } from "@/lib/training/mock";
import { listProgress, listProgressForStaff, upsertProgress } from "@/lib/training/repository";
import type { StaffTrainingProgress, StaffTrainingStatus } from "@/lib/training/types";

function isStaffTrainingStatus(value: unknown): value is StaffTrainingStatus {
  return value === "not_started" || value === "in_progress" || value === "completed";
}

function progressKey(staffName: string, moduleId: string) {
  return `${staffName}::${moduleId}`;
}

// In-memory overlay on top of the mock fixtures so completing a module still
// feels real when there's no database — same reasoning as ephemeralRecord in
// wholesale-orders/read/route.ts, it just can't survive a server restart.
const ephemeralOverrides = new Map<string, StaffTrainingProgress>();

function mockProgressWithOverrides(): StaffTrainingProgress[] {
  const merged = new Map<string, StaffTrainingProgress>();
  for (const row of mockStaffTrainingProgress) merged.set(progressKey(row.staffName, row.moduleId), row);
  Array.from(ephemeralOverrides.values()).forEach((row) => merged.set(progressKey(row.staffName, row.moduleId), row));
  return Array.from(merged.values());
}

/** Lists staff training progress — all staff for the admin grid, or one staff's rows for "My Training". */
export async function GET(request: NextRequest) {
  const staffName = request.nextUrl.searchParams.get("staffName");

  if (!isDatabaseConfigured()) {
    const rows = staffName
      ? mockProgressWithOverrides().filter((row) => row.staffName === staffName)
      : mockProgressWithOverrides();
    return NextResponse.json({ progress: rows });
  }

  const rows = staffName ? await listProgressForStaff(staffName) : await listProgress();
  return NextResponse.json({ progress: rows });
}

/** Saves a module attempt (in-progress or completed, with quiz score) for one staff member. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const { staffName, moduleId, status, quizScore, quizAttempts, trainerInitial } = body as Record<string, unknown>;
  if (typeof staffName !== "string" || !staffName.trim()) {
    return NextResponse.json({ error: "staffName is required." }, { status: 400 });
  }
  if (typeof moduleId !== "string" || !moduleId.trim()) {
    return NextResponse.json({ error: "moduleId is required." }, { status: 400 });
  }
  if (!isStaffTrainingStatus(status)) {
    return NextResponse.json(
      { error: 'status must be "not_started", "in_progress", or "completed".' },
      { status: 400 }
    );
  }

  const normalizedQuizScore = typeof quizScore === "number" ? quizScore : null;
  const normalizedQuizAttempts = typeof quizAttempts === "number" ? quizAttempts : 0;
  const normalizedTrainerInitial = typeof trainerInitial === "string" ? trainerInitial : null;

  if (!isDatabaseConfigured()) {
    const record: StaffTrainingProgress = {
      id: `ephemeral-${progressKey(staffName, moduleId)}`,
      staffName,
      moduleId,
      status,
      quizScore: normalizedQuizScore,
      quizAttempts: normalizedQuizAttempts,
      completedAt: status === "completed" ? new Date().toISOString() : null,
      trainerInitial: normalizedTrainerInitial,
    };
    ephemeralOverrides.set(progressKey(staffName, moduleId), record);
    return NextResponse.json({ progress: record, persisted: false });
  }

  const progress = await upsertProgress({
    staffName,
    moduleId,
    status,
    quizScore: normalizedQuizScore,
    quizAttempts: normalizedQuizAttempts,
    trainerInitial: normalizedTrainerInitial,
  });
  return NextResponse.json({ progress, persisted: true });
}
