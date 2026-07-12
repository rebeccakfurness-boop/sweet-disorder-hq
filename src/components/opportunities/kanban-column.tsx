"use client";

import { useDroppable } from "@dnd-kit/core";

import type { Opportunity, OpportunityStage } from "@/lib/types";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { stageChartColors } from "@/lib/chart-colors";
import { cn, formatCurrencyNZD } from "@/lib/utils";

export function KanbanColumn({
  stage,
  label,
  opportunities,
}: {
  stage: OpportunityStage;
  label: string;
  opportunities: Opportunity[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const totalValue = opportunities.reduce((sum, o) => sum + o.estimatedValue, 0);

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: stageChartColors[stage] }}
          />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {opportunities.length}
          </span>
        </div>
      </div>
      <p className="mb-3 px-1 text-xs text-muted-foreground">{formatCurrencyNZD(totalValue)}</p>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2.5 rounded-xl border border-dashed border-transparent bg-muted/40 p-2 transition-colors",
          isOver && "border-primary/40 bg-primary/5"
        )}
      >
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
        {opportunities.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">No opportunities here.</p>
        ) : null}
      </div>
    </div>
  );
}
