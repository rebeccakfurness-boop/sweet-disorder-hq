import { eq } from "drizzle-orm";

import { db } from "@/db";
import { staffTrainingProgress, trainingModules } from "@/db/schema";
import type {
  StaffTrainingProgress,
  StaffTrainingStatus,
  TrainingModule,
  TrainingQuizQuestion,
  TrainingSection,
} from "./types";

function mapModuleRow(row: typeof trainingModules.$inferSelect): TrainingModule {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    sourceDocument: row.sourceDocument,
    sections: row.sections as TrainingSection[],
    quizQuestions: row.quizQuestions as TrainingQuizQuestion[],
    createdAt: row.createdAt.toISOString(),
  };
}

function mapProgressRow(row: typeof staffTrainingProgress.$inferSelect): StaffTrainingProgress {
  return {
    id: row.id,
    staffName: row.staffName,
    moduleId: row.moduleId,
    status: row.status as StaffTrainingStatus,
    quizScore: row.quizScore,
    quizAttempts: row.quizAttempts,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    trainerInitial: row.trainerInitial,
  };
}

export async function listModules(): Promise<TrainingModule[]> {
  const rows = await db.query.trainingModules.findMany({
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });
  return rows.map(mapModuleRow);
}

export async function getModuleBySlug(slug: string): Promise<TrainingModule | null> {
  const row = await db.query.trainingModules.findFirst({ where: eq(trainingModules.slug, slug) });
  return row ? mapModuleRow(row) : null;
}

export async function listProgress(): Promise<StaffTrainingProgress[]> {
  const rows = await db.query.staffTrainingProgress.findMany();
  return rows.map(mapProgressRow);
}

export async function listProgressForStaff(staffName: string): Promise<StaffTrainingProgress[]> {
  const rows = await db.query.staffTrainingProgress.findMany({
    where: eq(staffTrainingProgress.staffName, staffName),
  });
  return rows.map(mapProgressRow);
}

export interface UpsertProgressInput {
  staffName: string;
  moduleId: string;
  status: StaffTrainingStatus;
  quizScore?: number | null;
  quizAttempts?: number;
  trainerInitial?: string | null;
}

/**
 * Upserts on (staffName, moduleId) — retaking a module updates that staff
 * member's one row for it rather than duplicating it.
 */
export async function upsertProgress(input: UpsertProgressInput): Promise<StaffTrainingProgress> {
  const values = {
    staffName: input.staffName,
    moduleId: input.moduleId,
    status: input.status,
    quizScore: input.quizScore ?? null,
    quizAttempts: input.quizAttempts ?? 0,
    completedAt: input.status === "completed" ? new Date() : null,
    trainerInitial: input.trainerInitial ?? null,
    updatedAt: new Date(),
  };

  const [row] = await db
    .insert(staffTrainingProgress)
    .values(values)
    .onConflictDoUpdate({
      target: [staffTrainingProgress.staffName, staffTrainingProgress.moduleId],
      set: values,
    })
    .returning();
  return mapProgressRow(row);
}
