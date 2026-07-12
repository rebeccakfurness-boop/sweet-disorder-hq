"use client";

import { useDraggable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";

export function DndCard({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group relative cursor-grab rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-popover active:cursor-grabbing",
        isDragging && "z-10 opacity-60",
        className
      )}
    >
      {children}
    </div>
  );
}
