"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { productionStaff } from "@/lib/mock/production";
import { checklistItems as initialItems, checklistFocus } from "@/lib/mock/checklist";
import { cn, initials } from "@/lib/utils";

export function EmployeeChecklist() {
  const [items, setItems] = useState(initialItems);

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-foreground">Today&apos;s Checklist</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {productionStaff.map((staff) => {
          const staffItems = items.filter((item) => item.staff === staff);
          const completedCount = staffItems.filter((item) => item.completed).length;
          const progress = staffItems.length === 0 ? 0 : (completedCount / staffItems.length) * 100;

          return (
            <Card key={staff}>
              <CardHeader className="gap-3 space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">{initials(staff)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold leading-tight text-foreground">{staff}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      Today: {checklistFocus[staff]}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {completedCount} of {staffItems.length} tasks complete
                    </span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1 pt-0">
                {staffItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-accent/60"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        item.completed
                          ? "border-mint bg-mint text-mint-foreground"
                          : "border-border text-transparent"
                      )}
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span
                      className={cn(
                        "text-base leading-snug",
                        item.completed ? "text-muted-foreground line-through" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
