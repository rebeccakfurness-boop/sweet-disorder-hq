import { notFound } from "next/navigation";

import { QuotePreviewClient } from "@/components/quotes/quote-preview-client";
import { quotes } from "@/lib/mock/quotes";
import { getCompanyById, getContactsByCompanyId } from "@/lib/mock/companies";

export default function QuoteDetailPage({ params }: { params: { quoteId: string } }) {
  const quote = quotes.find((q) => q.id === params.quoteId);
  if (!quote) notFound();

  const company = getCompanyById(quote.companyId);
  const contacts = company ? getContactsByCompanyId(company.id) : [];
  const primaryContact = contacts.find((c) => c.isPrimary) ?? contacts[0];

  return (
    <QuotePreviewClient
      data={{
        quoteNumber: quote.quoteNumber,
        company,
        contactName: primaryContact?.name,
        lineItems: quote.lineItems,
        subtotal: quote.subtotal,
        discountPercent: quote.discountPercent,
        total: quote.total,
        createdAt: quote.createdAt,
        validUntil: quote.validUntil,
      }}
    />
  );
}
