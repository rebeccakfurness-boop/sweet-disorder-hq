"use client";

import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";

import { DndBoard } from "@/components/shared/kanban";
import { OpsColumn } from "@/components/business-ops/ops-column";
import { PageHeader } from "@/components/shared/page-header";
import { opsTasks as initialTasks, horizonOrder, horizonLabels } from "@/lib/mock/ops-tasks";
import { burstConfettiAt, encouragingMessages, pickRandom } from "@/lib/confetti";
import type { OpsTaskHorizon } from "@/lib/types";

export function OpsBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [celebrations, setCelebrations] = useState<Record<string, string>>({});

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newHorizon = over.id as OpsTaskHorizon;
    if (!horizonOrder.includes(newHorizon)) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === active.id ? { ...task, horizon: newHorizon } : task))
    );
  }

  function toggleComplete(id: string, event: React.MouseEvent<HTMLButtonElement>) {
    const wasCompleted = tasks.find((task) => task.id === id)?.completed ?? false;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));

    if (!wasCompleted) {
      burstConfettiAt(x, y);
      const message = pickRandom(encouragingMessages);
      setCelebrations((prev) => ({ ...prev, [id]: message }));
      setTimeout(() => {
        setCelebrations((prev) => {
          const rest = { ...prev };
          delete rest[id];
          return rest;
        });
      }, 1600);
    }
  }

  return (
    <div>
      <PageHeader
        title="Business Operations"
        description="Molly's own board — systems, marketing, compliance, and everything else that keeps the business running."
      />

      <DndBoard onDragEnd={handleDragEnd}>
        {horizonOrder.map((horizon) => (
          <OpsColumn
            key={horizon}
            horizon={horizon}
            label={horizonLabels[horizon]}
            tasks={tasks.filter((task) => task.horizon === horizon)}
            celebrations={celebrations}
            onToggleComplete={toggleComplete}
          />
        ))}
      </DndBoard>
    </div>
  );
}
