import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CompanyTypeBadge, StageBadge, QuoteStatusBadge } from "@/components/shared/status-badges";
import {
  getCompanyById,
  getContactsByCompanyId,
  getOpportunitiesByCompanyId,
  getQuotesByCompanyId,
} from "@/lib/mock";
import { formatCurrencyNZD, formatDate, initials } from "@/lib/utils";

export default function CompanyDetailPage({ params }: { params: { companyId: string } }) {
  const company = getCompanyById(params.companyId);
  if (!company) notFound();

  const contacts = getContactsByCompanyId(company.id);
  const opportunities = getOpportunitiesByCompanyId(company.id);
  const quotes = getQuotesByCompanyId(company.id);

  return (
    <div>
      <Link
        href="/crm"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Corporate CRM
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{company.name}</h1>
            <CompanyTypeBadge type={company.type} />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {company.region}, {company.country}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" asChild>
            <Link href={`/opportunities?company=${company.id}`}>
              <Plus className="h-4 w-4" />
              New Opportunity
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/quotes/new?company=${company.id}`}>
              <Plus className="h-4 w-4" />
              Create Quote
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{company.notes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Linked Opportunities ({opportunities.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {opportunities.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No opportunities yet for this account.
                </p>
              ) : (
                opportunities.map((opp, index) => (
                  <div key={opp.id}>
                    {index > 0 ? <Separator className="my-1" /> : null}
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{opp.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {opp.nextFollowUpDate
                            ? `Follow up ${formatDate(opp.nextFollowUpDate)}`
                            : "No follow-up scheduled"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrencyNZD(opp.estimatedValue)}
                        </span>
                        <StageBadge stage={opp.stage} />
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Linked Quotes ({quotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {quotes.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No quotes yet for this account.</p>
              ) : (
                quotes.map((quote, index) => (
                  <div key={quote.id}>
                    {index > 0 ? <Separator className="my-1" /> : null}
                    <Link
                      href={`/quotes/${quote.id}`}
                      className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{quote.quoteNumber}</p>
                        <p className="text-xs text-muted-foreground">Valid until {formatDate(quote.validUntil)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrencyNZD(quote.total)}
                        </span>
                        <QuoteStatusBadge status={quote.status} />
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.title}</p>
                    <div className="mt-1.5 space-y-1">
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Company Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <CompanyTypeBadge type={company.type} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Region</span>
                <span className="text-foreground">{company.region}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Country</span>
                <span className="text-foreground">{company.country}</span>
              </div>
              {company.website ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Website</span>
                  <span className="flex items-center gap-1 text-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    {company.website}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Activity</span>
                <span className="text-foreground">{formatDate(company.lastActivityAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
