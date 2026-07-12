"use client";

import { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { tasks as initialTasks, getCompanyById } from "@/lib/mock";
import {
  burstConfettiAt,
  burstCelebration,
  encouragingMessages,
  allDoneMessages,
  pickRandom,
} from "@/lib/confetti";
import { cn, initials } from "@/lib/utils";
import type { StaffTask } from "@/lib/types";

export function TodaysTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [celebrations, setCelebrations] = useState<Record<string, string>>({});
  const [allDone, setAllDone] = useState<Record<string, string | null>>({});
  const celebratedRef = useRef<Record<string, boolean>>({});

  function toggleTask(id: string, assignee: string, event: React.MouseEvent<HTMLButtonElement>) {
    const wasCompleted = tasks.find((task) => task.id === id)?.completed ?? false;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const next = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
    setTasks(next);

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

      const assigneeTasks = next.filter((task) => task.assignedTo === assignee);
      const allComplete = assigneeTasks.every((task) => task.completed);
      if (allComplete && !celebratedRef.current[assignee]) {
        celebratedRef.current[assignee] = true;
        burstCelebration();
        const message2 = pickRandom(allDoneMessages);
        setAllDone((prev) => ({ ...prev, [assignee]: message2 }));
        setTimeout(() => {
          setAllDone((prev) => ({ ...prev, [assignee]: null }));
        }, 4000);
      }
    } else {
      celebratedRef.current[assignee] = false;
    }
  }

  const groups = useMemo(() => {
    const byAssignee = new Map<string, StaffTask[]>();
    for (const task of tasks) {
      const existing = byAssignee.get(task.assignedTo);
      if (existing) {
        existing.push(task);
      } else {
        byAssignee.set(task.assignedTo, [task]);
      }
    }
    return Array.from(byAssignee.entries());
  }, [tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Today&apos;s tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {groups.map(([assignee, assigneeTasks]) => (
          <div key={assignee}>
            <div className="mb-1.5 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px]">{initials(assignee)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{assignee}</span>
              {allDone[assignee] ? (
                <span className="animate-in fade-in slide-in-from-left-1 rounded-full bg-mint/15 px-2 py-0.5 text-xs font-medium text-mint">
                  {allDone[assignee]}
                </span>
              ) : null}
            </div>
            <div className="space-y-1">
              {assigneeTasks.map((task) => {
                const company = task.companyId ? getCompanyById(task.companyId) : null;
                return (
                  <div key={task.id} className="relative">
                    {celebrations[task.id] ? (
                      <span className="pointer-events-none absolute -top-1 right-2 z-10 animate-in fade-in slide-in-from-bottom-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium text-primary shadow-popover">
                        {celebrations[task.id]}
                      </span>
                    ) : null}
                    <button
                      onClick={(event) => toggleTask(task.id, assignee, event)}
                      className="flex w-full items-start gap-3 rounded-lg py-2 pl-8 pr-2 text-left transition-colors hover:bg-accent/60"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          task.completed
                            ? "border-mint bg-mint text-mint-foreground"
                            : "border-border text-transparent"
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-sm",
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                          )}
                        >
                          {task.title}
                        </span>
                        {company ? (
                          <span className="mt-0.5 block text-xs text-muted-foreground">{company.name}</span>
                        ) : null}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
