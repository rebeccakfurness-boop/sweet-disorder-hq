"use client";

import { useRef, useState } from "react";
import { Check, Clock, Layers } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProductionPriorityBadge } from "@/components/shared/status-badges";
import { productionStaff } from "@/lib/mock/production";
import { checklistItems as initialItems, checklistBoards } from "@/lib/mock/checklist";
import {
  burstConfettiAt,
  burstCelebration,
  encouragingMessages,
  allDoneMessages,
  pickRandom,
} from "@/lib/confetti";
import { cn, initials } from "@/lib/utils";
import type { ProductionStaffMember } from "@/lib/types";

export function EmployeeChecklist() {
  const [items, setItems] = useState(initialItems);
  const [celebrations, setCelebrations] = useState<Record<string, string>>({});
  const [allDone, setAllDone] = useState<Record<ProductionStaffMember, string | null>>({
    Ange: null,
    Charlie: null,
  });
  const celebratedRef = useRef<Record<ProductionStaffMember, boolean>>({ Ange: false, Charlie: false });

  function toggleItem(itemId: string, staff: ProductionStaffMember, event: React.MouseEvent<HTMLButtonElement>) {
    const wasCompleted = items.find((item) => item.id === itemId)?.completed ?? false;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const next = items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item));
    setItems(next);

    if (!wasCompleted) {
      burstConfettiAt(x, y);
      const message = pickRandom(encouragingMessages);
      setCelebrations((prev) => ({ ...prev, [itemId]: message }));
      setTimeout(() => {
        setCelebrations((prev) => {
          const rest = { ...prev };
          delete rest[itemId];
          return rest;
        });
      }, 1600);

      const staffItems = next.filter((item) => item.staff === staff);
      const allComplete = staffItems.every((item) => item.completed);
      if (allComplete && !celebratedRef.current[staff]) {
        celebratedRef.current[staff] = true;
        burstCelebration();
        const message2 = pickRandom(allDoneMessages);
        setAllDone((prev) => ({ ...prev, [staff]: message2 }));
        setTimeout(() => {
          setAllDone((prev) => ({ ...prev, [staff]: null }));
        }, 4000);
      }
    } else {
      // Un-ticking reopens the board for further celebration later.
      celebratedRef.current[staff] = false;
    }
  }

  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-foreground">Today&apos;s Checklist</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {productionStaff.map((staff) => {
          const board = checklistBoards[staff];
          const staffItems = items.filter((item) => item.staff === staff);
          const completedCount = staffItems.filter((item) => item.completed).length;
          const remaining = staffItems.length - completedCount;
          const progress = staffItems.length === 0 ? 0 : (completedCount / staffItems.length) * 100;

          const orderedItems = [
            ...staffItems.filter((item) => !item.completed),
            ...staffItems.filter((item) => item.completed),
          ];

          return (
            <Card key={staff} className="relative overflow-hidden">
              {allDone[staff] ? (
                <div className="absolute inset-x-0 top-0 z-10 animate-in fade-in slide-in-from-top-2 bg-mint px-4 py-2.5 text-center text-sm font-semibold text-mint-foreground">
                  {allDone[staff]}
                </div>
              ) : null}
              <CardHeader className="gap-3 space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">{initials(staff)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold leading-tight text-foreground">{staff}</p>
                    <p className="truncate text-xs text-muted-foreground">Today: {board.jobName}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {completedCount} of {staffItems.length} tasks complete
                    </span>
                    <span className="text-xs text-muted-foreground">{remaining} remaining</span>
                  </div>
                  <Progress value={progress} className="h-2.5 transition-all" />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    Batch {board.batchCode}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Est. finish {board.estimatedFinishTime}
                  </span>
                  <ProductionPriorityBadge priority={board.priority} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                {orderedItems.map((item) => (
                  <div key={item.id} className="relative">
                    {celebrations[item.id] ? (
                      <span className="pointer-events-none absolute -top-1 right-2 z-10 animate-in fade-in slide-in-from-bottom-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium text-primary shadow-popover">
                        {celebrations[item.id]}
                      </span>
                    ) : null}
                    <button
                      onClick={(event) => toggleItem(item.id, staff, event)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-all duration-200",
                        item.completed ? "opacity-60" : "hover:bg-accent/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                          item.completed
                            ? "scale-105 border-mint bg-mint text-mint-foreground"
                            : "border-border text-transparent"
                        )}
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span
                        className={cn(
                          "text-base leading-snug transition-colors duration-200",
                          item.completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
