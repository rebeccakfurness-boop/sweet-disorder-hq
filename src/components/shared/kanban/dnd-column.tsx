"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";

export function DndColumn({
  id,
  header,
  subheader,
  children,
  isEmpty,
  emptyLabel = "Nothing here.",
}: {
  id: string;
  header: React.ReactNode;
  subheader?: React.ReactNode;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyLabel?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 px-1">{header}</div>
      {subheader ? <div className="mb-3 px-1">{subheader}</div> : null}

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2.5 rounded-xl border border-dashed border-transparent bg-muted/40 p-2 transition-colors",
          isOver && "border-primary/40 bg-primary/5"
        )}
      >
        {children}
        {isEmpty ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">{emptyLabel}</p>
        ) : null}
      </div>
    </div>
  );
}
