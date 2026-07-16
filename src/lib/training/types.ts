export interface TrainingSection {
  heading: string;
  content: string;
  isKeyRule: boolean;
}

export interface TrainingQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

// One row per training guide (see src/db/schema/training.ts). `sections` is
// empty and `sourceDocument` is null for topics carried over from the paper
// sign-off sheet that don't have a written guide yet.
export interface TrainingModule {
  id: string;
  slug: string;
  title: string;
  sourceDocument: string | null;
  sections: TrainingSection[];
  quizQuestions: TrainingQuizQuestion[];
  createdAt: string;
}

export type StaffTrainingStatus = "not_started" | "in_progress" | "completed";

// One row per staff member's attempt at a module — the sign-off equivalent
// of the paper record's Staff Initial / Trainer Initial / Date columns.
export interface StaffTrainingProgress {
  id: string;
  staffName: string;
  moduleId: string;
  status: StaffTrainingStatus;
  quizScore: number | null;
  quizAttempts: number;
  completedAt: string | null;
  trainerInitial: string | null;
}
