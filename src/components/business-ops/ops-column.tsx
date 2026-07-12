import { DndColumn } from "@/components/shared/kanban";
import { OpsCard } from "@/components/business-ops/ops-card";
import { opsHorizonColors } from "@/lib/chart-colors";
import type { OpsTask, OpsTaskHorizon } from "@/lib/types";

export function OpsColumn({
  horizon,
  label,
  tasks,
  celebrations,
  onToggleComplete,
}: {
  horizon: OpsTaskHorizon;
  label: string;
  tasks: OpsTask[];
  celebrations: Record<string, string>;
  onToggleComplete: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <DndColumn
      id={horizon}
      header={
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opsHorizonColors[horizon] }} />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      }
      isEmpty={tasks.length === 0}
      emptyLabel="Nothing here."
    >
      {tasks.map((task) => (
        <OpsCard
          key={task.id}
          task={task}
          celebrationMessage={celebrations[task.id]}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </DndColumn>
  );
}
