import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, User, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageBadge, QuoteStatusBadge } from "@/components/shared/status-badges";
import { getOpportunityById } from "@/lib/mock/opportunities";
import { getCompanyById, getContactsByCompanyId } from "@/lib/mock/companies";
import { getQuoteByOpportunityId } from "@/lib/mock/quotes";
import { formatCurrencyNZD, formatDate } from "@/lib/utils";

export default function OpportunityDetailPage({
  params,
}: {
  params: { opportunityId: string };
}) {
  const opportunity = getOpportunityById(params.opportunityId);
  if (!opportunity) notFound();

  const company = getCompanyById(opportunity.companyId);
  const contacts = company ? getContactsByCompanyId(company.id) : [];
  const primaryContact = contacts.find((c) => c.isPrimary) ?? contacts[0];
  const existingQuote = getQuoteByOpportunityId(opportunity.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/opportunities"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Opportunities
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{opportunity.title}</h1>
            <StageBadge stage={opportunity.stage} />
          </div>
          {company ? (
            <Link href={`/crm/${company.id}`} className="mt-1 text-sm text-muted-foreground hover:text-primary">
              {company.name}
            </Link>
          ) : null}
        </div>
        {existingQuote ? (
          <Button variant="outline" asChild>
            <Link href={`/quotes/${existingQuote.id}`}>
              <FileText className="h-4 w-4" />
              View Quote
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/quotes/new?opportunity=${opportunity.id}&company=${opportunity.companyId}`}>
              <Plus className="h-4 w-4" />
              Create Quote
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estimated Value
            </p>
            <p className="mt-1.5 text-xl font-semibold text-foreground">
              {formatCurrencyNZD(opportunity.estimatedValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              Next Follow-up
            </p>
            <p className="mt-1.5 text-xl font-semibold text-foreground">
              {opportunity.nextFollowUpDate ? formatDate(opportunity.nextFollowUpDate) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Owner
            </p>
            <p className="mt-1.5 text-xl font-semibold text-foreground">{opportunity.ownerName}</p>
          </CardContent>
        </Card>
      </div>

      {primaryContact ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            <span className="font-medium text-foreground">{primaryContact.name}</span>
            <span className="text-muted-foreground">{primaryContact.title}</span>
            <a href={`mailto:${primaryContact.email}`} className="text-muted-foreground hover:text-primary">
              {primaryContact.email}
            </a>
            <a href={`tel:${primaryContact.phone}`} className="text-muted-foreground hover:text-primary">
              {primaryContact.phone}
            </a>
          </CardContent>
        </Card>
      ) : null}

      {existingQuote ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Linked Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/quotes/${existingQuote.id}`}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-accent/60"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{existingQuote.quoteNumber}</p>
                <p className="text-xs text-muted-foreground">Valid until {formatDate(existingQuote.validUntil)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  {formatCurrencyNZD(existingQuote.total)}
                </span>
                <QuoteStatusBadge status={existingQuote.status} />
              </div>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
