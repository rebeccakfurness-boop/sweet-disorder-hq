import { DndColumn } from "@/components/shared/kanban";
import type { Opportunity, OpportunityStage } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { stageChartColors } from "@/lib/chart-colors";
import { formatCurrencyNZD } from "@/lib/utils";

export function KanbanColumn({
  stage,
  label,
  opportunities,
}: {
  stage: OpportunityStage;
  label: string;
  opportunities: Opportunity[];
}) {
  const totalValue = opportunities.reduce((sum, o) => sum + o.estimatedValue, 0);

  return (
    <DndColumn
      id={stage}
      header={
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stageChartColors[stage] }} />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {opportunities.length}
          </span>
        </div>
      }
      subheader={<p className="text-xs text-muted-foreground">{formatCurrencyNZD(totalValue)}</p>}
      isEmpty={opportunities.length === 0}
      emptyLabel="No opportunities here."
    >
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </DndColumn>
  );
}
