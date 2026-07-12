"use client";

import Link from "next/link";
import { CalendarClock, ChevronRight } from "lucide-react";

import type { Opportunity } from "@/lib/types";
import { getCompanyById } from "@/lib/mock/companies";
import { DndCard } from "@/components/shared/kanban";
import { formatCurrencyNZD, formatDateShort } from "@/lib/utils";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const company = getCompanyById(opportunity.companyId);

  return (
    <DndCard id={opportunity.id} className="group">
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
    </DndCard>
  );
}
