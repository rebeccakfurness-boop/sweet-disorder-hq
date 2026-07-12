"use client";

import Link from "next/link";
import { useDraggable } from "@dnd-kit/core";
import { CalendarClock, ChevronRight } from "lucide-react";

import type { Opportunity } from "@/lib/types";
import { getCompanyById } from "@/lib/mock/companies";
import { cn, formatCurrencyNZD, formatDateShort } from "@/lib/utils";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const company = getCompanyById(opportunity.companyId);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: opportunity.id,
  });

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
        isDragging && "z-10 opacity-60"
      )}
    >
      <Link
        href={`/opportunities/${opportunity.id}`}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-2 top-2 text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
      <p className="pr-4 text-sm font-medium leading-snug text-foreground">{company?.name}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{opportunity.title}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {formatCurrencyNZD(opportunity.estimatedValue)}
        </span>
        {opportunity.nextFollowUpDate ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="h-3 w-3" />
            {formatDateShort(opportunity.nextFollowUpDate)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
