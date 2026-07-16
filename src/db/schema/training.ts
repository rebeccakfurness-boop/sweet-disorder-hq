import { pgTable, pgEnum, uuid, text, jsonb, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Staff Training / LMS — the digital equivalent of the paper
// Staff_Training_record.xlsx sign-off sheet (Topic -> sub-points -> Staff
// Initial / Trainer Initial / Date). A trainingModule holds one guide's
// content as an ordered walkthrough plus a quiz; staffTrainingProgress is one
// row per staff member's attempt at a module, with trainerInitial standing in
// for the paper sheet's sign-off column.
//
// Kept independent of src/lib/training/types.ts (same pattern as
// wholesale-orders.ts / knowledge.ts) so this file never needs to import from
// lib/ — src/lib/training/repository.ts is the one place that maps between
// the two shapes.
// ---------------------------------------------------------------------------

export const staffTrainingStatusEnum = pgEnum("staff_training_status", [
  "not_started",
  "in_progress",
  "completed",
]);

interface TrainingSectionRow {
  heading: string;
  content: string;
  isKeyRule: boolean;
}

interface TrainingQuizQuestionRow {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const trainingModules = pgTable(
  "training_modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    // Null for topics from the paper sign-off sheet with no guide written yet
    // (Heat Gun, Lifting, etc) — sections stays [] for these until content
    // exists, so they surface in the admin list as "content needed" rather
    // than being silently missing.
    sourceDocument: text("source_document"),
    sections: jsonb("sections").$type<TrainingSectionRow[]>().notNull().default([]),
    quizQuestions: jsonb("quiz_questions").$type<TrainingQuizQuestionRow[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("training_modules_slug_idx").on(table.slug),
  })
);

export const staffTrainingProgress = pgTable(
  "staff_training_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // Free text, not a real staff table — no auth/staff records exist yet
    // (same reasoning as reviewedBy in wholesale-orders.ts).
    staffName: text("staff_name").notNull(),
    moduleId: uuid("module_id")
      .references(() => trainingModules.id, { onDelete: "cascade" })
      .notNull(),
    status: staffTrainingStatusEnum("status").default("not_started").notNull(),
    quizScore: integer("quiz_score"),
    quizAttempts: integer("quiz_attempts").default(0).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    // The paper sheet's "Trainer Initial" column equivalent — null until
    // someone senior has actually checked the completion off.
    trainerInitial: text("trainer_initial"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    staffModuleIdx: uniqueIndex("staff_training_progress_staff_module_idx").on(
      table.staffName,
      table.moduleId
    ),
  })
);

export const trainingModulesRelations = relations(trainingModules, ({ many }) => ({
  progress: many(staffTrainingProgress),
}));

export const staffTrainingProgressRelations = relations(staffTrainingProgress, ({ one }) => ({
  module: one(trainingModules, {
    fields: [staffTrainingProgress.moduleId],
    references: [trainingModules.id],
  }),
}));
