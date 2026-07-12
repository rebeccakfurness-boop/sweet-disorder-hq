"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeeklyScheduleForStaff, TODAY_LABEL, type Weekday } from "@/lib/mock/weekly-schedule";
import { cn } from "@/lib/utils";
import type { ProductionStaffMember } from "@/lib/types";

export function WeeklyBreakdown({
  staff,
  todayJobName,
  todayCompleted,
  todayTotal,
}: {
  staff: ProductionStaffMember;
  todayJobName: string;
  todayCompleted: number;
  todayTotal: number;
}) {
  const [expandedDay, setExpandedDay] = useState<Weekday | null>(null);
  const days = getWeeklyScheduleForStaff(staff);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">This Week</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0">
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-primary">{TODAY_LABEL} · Today</span>
            <Badge variant="default">
              {todayCompleted}/{todayTotal}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{todayJobName} — see checklist above</p>
        </div>

        {days.map((entry) => {
          const isExpanded = expandedDay === entry.day;
          return (
            <div
              key={entry.id}
              className={cn(
                "rounded-lg border border-border transition-colors",
                entry.completed && "border-transparent bg-muted/40"
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedDay(isExpanded ? null : entry.day)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2">
                  {entry.completed ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-mint text-mint-foreground">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      entry.completed ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {entry.day} {entry.date}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">{entry.tasks.length} tasks</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </span>
              </button>
              {isExpanded ? (
                <ul className="space-y-1 px-3 pb-2.5 pl-9">
                  {entry.tasks.map((task) => (
                    <li key={task} className="text-xs leading-relaxed text-muted-foreground">
                      • {task}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="truncate px-3 pb-2.5 pl-9 text-xs text-muted-foreground">
                  {entry.tasks.join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
