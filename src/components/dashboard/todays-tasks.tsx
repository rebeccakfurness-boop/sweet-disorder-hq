"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks as initialTasks } from "@/lib/mock";
import { getCompanyById } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function TodaysTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Today&apos;s tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {tasks.map((task) => {
          const company = task.companyId ? getCompanyById(task.companyId) : null;
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-accent/60"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  task.completed ? "border-mint bg-mint text-mint-foreground" : "border-border text-transparent"
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
      </CardContent>
    </Card>
  );
}
