"use client";

import { Check, CalendarClock } from "lucide-react";

import { DndCard } from "@/components/shared/kanban";
import { OpsTagBadge } from "@/components/shared/status-badges";
import { cn, formatDateShort } from "@/lib/utils";
import type { OpsTask } from "@/lib/types";

export function OpsCard({
  task,
  celebrationMessage,
  onToggleComplete,
}: {
  task: OpsTask;
  celebrationMessage?: string;
  onToggleComplete: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <DndCard id={task.id} className={cn(task.completed && "opacity-60")}>
      {celebrationMessage ? (
        <span className="pointer-events-none absolute -top-2.5 right-2 z-10 animate-in fade-in slide-in-from-bottom-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium text-primary shadow-popover">
          {celebrationMessage}
        </span>
      ) : null}
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onToggleComplete(task.id, event);
          }}
          aria-label={task.completed ? "Mark as not done" : "Mark as done"}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            task.completed
              ? "border-mint bg-mint text-mint-foreground"
              : "border-border text-transparent hover:border-primary/50"
          )}
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </button>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              task.completed ? "text-muted-foreground line-through" : "text-foreground"
            )}
          >
            {task.title}
          </p>
          {task.tag || task.dueDate ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {task.tag ? <OpsTagBadge tag={task.tag} /> : null}
              {task.dueDate ? (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  {formatDateShort(task.dueDate)}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </DndCard>
  );
}
