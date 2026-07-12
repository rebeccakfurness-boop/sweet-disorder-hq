"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { tasks as initialTasks, getCompanyById } from "@/lib/mock";
import { cn, initials } from "@/lib/utils";
import type { StaffTask } from "@/lib/types";

export function TodaysTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
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
            </div>
            <div className="space-y-1">
              {assigneeTasks.map((task) => {
                const company = task.companyId ? getCompanyById(task.companyId) : null;
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
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
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
