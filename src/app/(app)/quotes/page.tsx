import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuoteStatusBadge } from "@/components/shared/status-badges";
import { quotes, getCompanyById } from "@/lib/mock";
import { formatCurrencyNZD, formatDate } from "@/lib/utils";

export default function QuotesPage() {
  return (
    <div>
      <PageHeader
        title="Quotes"
        description="Every quote sent, accepted, or still awaiting a reply."
        actions={
          <Button asChild className="gap-1.5">
            <Link href="/quotes/new">
              <Plus className="h-4 w-4" />
              New Quote
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => {
              const company = getCompanyById(quote.companyId);
              return (
                <TableRow key={quote.id}>
                  <TableCell>
                    <Link href={`/quotes/${quote.id}`} className="font-medium text-foreground hover:text-primary">
                      {quote.quoteNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{company?.name}</TableCell>
                  <TableCell>
                    <QuoteStatusBadge status={quote.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(quote.validUntil)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    {formatCurrencyNZD(quote.total)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
