import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainingStatusBadge } from "@/components/training/training-status-badge";
import type { StaffTrainingProgress, TrainingModule } from "@/lib/training/types";

const actionLabels = {
  not_started: "Start",
  in_progress: "Continue",
  completed: "Review",
} as const;

export function MyTrainingList({
  modules,
  progress,
  onStart,
}: {
  modules: TrainingModule[];
  progress: StaffTrainingProgress[];
  onStart: (module: TrainingModule) => void;
}) {
  const progressByModuleId = new Map(progress.map((row) => [row.moduleId, row]));

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const hasContent = module.sections.length > 0 && module.quizQuestions.length > 0;
        const row = progressByModuleId.get(module.id);
        const status = row?.status ?? "not_started";

        return (
          <Card key={module.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{module.title}</p>
                {row?.status === "completed" && row.quizScore !== null ? (
                  <p className="text-xs text-muted-foreground">
                    First attempt score {row.quizScore}% · {row.quizAttempts} attempt
                    {row.quizAttempts === 1 ? "" : "s"}
                  </p>
                ) : !hasContent ? (
                  <p className="text-xs text-muted-foreground">Guide not written yet</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {hasContent ? (
                  <TrainingStatusBadge status={status} />
                ) : (
                  <Badge variant="outline" className="gap-1.5">
                    <FileQuestion className="h-3.5 w-3.5" />
                    Content needed
                  </Badge>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant={status === "completed" ? "outline" : "default"}
                  disabled={!hasContent}
                  onClick={() => onStart(module)}
                >
                  {actionLabels[status]}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
