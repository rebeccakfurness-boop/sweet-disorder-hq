import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrainingStatusBadge } from "@/components/training/training-status-badge";
import type { StaffTrainingProgress, TrainingModule } from "@/lib/training/types";

export function AdminProgressGrid({
  modules,
  progress,
  staffRoster,
}: {
  modules: TrainingModule[];
  progress: StaffTrainingProgress[];
  staffRoster: readonly string[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            {staffRoster.map((staff) => (
              <TableHead key={staff}>{staff}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((module) => {
            const hasContent = module.sections.length > 0 && module.quizQuestions.length > 0;
            return (
              <TableRow key={module.id}>
                <TableCell className="font-medium text-foreground">
                  {module.title}
                  {!hasContent ? (
                    <p className="text-xs font-normal text-muted-foreground">No guide written yet</p>
                  ) : null}
                </TableCell>
                {staffRoster.map((staff) => {
                  if (!hasContent) {
                    return (
                      <TableCell key={staff}>
                        <Badge variant="outline">Content needed</Badge>
                      </TableCell>
                    );
                  }
                  const row = progress.find((p) => p.staffName === staff && p.moduleId === module.id);
                  return (
                    <TableCell key={staff}>
                      <TrainingStatusBadge status={row?.status ?? "not_started"} />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
