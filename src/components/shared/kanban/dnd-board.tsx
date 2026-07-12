"use client";

import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";

/**
 * The drag-and-drop wiring shared by every kanban-style board in the app —
 * sensor setup, activation distance (so a click doesn't register as a
 * drag), and the horizontally-scrolling column row. Boards bring their own
 * columns/cards and an `onDragEnd` handler that decides what a drop means.
 */
export function DndBoard({
  onDragEnd,
  children,
}: {
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">{children}</div>
    </DndContext>
  );
}
