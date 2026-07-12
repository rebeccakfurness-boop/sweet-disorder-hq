"use client";

import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";

import { DndBoard } from "@/components/shared/kanban";
import { KanbanColumn } from "@/components/opportunities/kanban-column";
import { NewOpportunityDialog } from "@/components/opportunities/new-opportunity-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { opportunities as initialOpportunities, stageOrder, stageLabels } from "@/lib/mock/opportunities";
import type { Opportunity, OpportunityStage } from "@/lib/types";

export function KanbanBoard({ defaultCompanyId }: { defaultCompanyId?: string }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStage = over.id as OpportunityStage;
    if (!stageOrder.includes(newStage)) return;
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === active.id ? { ...opp, stage: newStage } : opp))
    );
  }

  return (
    <div>
      <PageHeader
        title="Opportunities"
        description="Drag a card to update its stage — Molly-approved, no spreadsheet required."
        actions={
          <NewOpportunityDialog
            defaultCompanyId={defaultCompanyId}
            onCreate={(opp) => setOpportunities((prev) => [opp, ...prev])}
          />
        }
      />

      <DndBoard onDragEnd={handleDragEnd}>
        {stageOrder.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            label={stageLabels[stage]}
            opportunities={opportunities.filter((o) => o.stage === stage)}
          />
        ))}
      </DndBoard>
    </div>
  );
}
