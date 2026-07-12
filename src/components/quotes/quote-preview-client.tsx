"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuotePreview, type QuotePreviewData } from "@/components/quotes/quote-preview";

export function QuotePreviewClient({ data }: { data: QuotePreviewData }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/quotes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Quotes
        </Link>
        <Button onClick={() => window.print()} className="gap-1.5">
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>
      <QuotePreview data={data} />
    </div>
  );
}
