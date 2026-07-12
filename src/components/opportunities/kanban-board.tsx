"use client";

import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";

import { KanbanColumn } from "@/components/opportunities/kanban-column";
import { NewOpportunityDialog } from "@/components/opportunities/new-opportunity-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { opportunities as initialOpportunities, stageOrder, stageLabels } from "@/lib/mock/opportunities";
import type { Opportunity, OpportunityStage } from "@/lib/types";

export function KanbanBoard({ defaultCompanyId }: { defaultCompanyId?: string }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

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

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stageOrder.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              label={stageLabels[stage]}
              opportunities={opportunities.filter((o) => o.stage === stage)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
