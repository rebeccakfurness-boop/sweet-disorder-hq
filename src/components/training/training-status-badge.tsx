import { Badge } from "@/components/ui/badge";
import type { StaffTrainingStatus } from "@/lib/training/types";

const statusLabels: Record<StaffTrainingStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

const statusVariants: Record<StaffTrainingStatus, "muted" | "mustard" | "mint"> = {
  not_started: "muted",
  in_progress: "mustard",
  completed: "mint",
};

export function TrainingStatusBadge({ status }: { status: StaffTrainingStatus }) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
