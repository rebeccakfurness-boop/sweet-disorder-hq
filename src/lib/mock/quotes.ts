import type { Quote, QuoteLineItem } from "@/lib/types";
import { getDiscountTierForQuantity } from "@/lib/pricing";

export function computeQuoteTotals(lineItems: Pick<QuoteLineItem, "quantity" | "unitPrice">[]) {
  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tier = getDiscountTierForQuantity(totalQuantity);
  const discountAmount = subtotal * (tier.discountPercent / 100);
  const total = subtotal - discountAmount;
  return { totalQuantity, subtotal, discountPercent: tier.discountPercent, total, tier };
}

function buildQuote(
  base: Omit<Quote, "lineItems" | "subtotal" | "total" | "discountPercent">,
  lineItems: Omit<QuoteLineItem, "id">[]
): Quote {
  const items: QuoteLineItem[] = lineItems.map((item, index) => ({
    ...item,
    id: `${base.id}-li-${index + 1}`,
  }));
  const { subtotal, total, discountPercent } = computeQuoteTotals(items);
  return { ...base, lineItems: items, subtotal, total, discountPercent };
}

export const quotes: Quote[] = [
  buildQuote(
    {
      id: "quote-036",
      quoteNumber: "SD-Q-2026-036",
      companyId: "co-quirky-nook",
      opportunityId: "opp-quirkynook-autumn",
      status: "accepted",
      validUntil: "2026-07-02",
      createdAt: "2026-06-02T13:50:00+12:00",
    },
    [
      { productId: "prod-bear-hugs", productName: "Bear Hugs", quantity: 20, unitPrice: 18 },
      { productId: "prod-chill-pills", productName: "Chill Pills", quantity: 15, unitPrice: 18 },
    ]
  ),
  buildQuote(
    {
      id: "quote-039",
      quoteNumber: "SD-Q-2026-039",
      companyId: "co-great-southern",
      opportunityId: "opp-greatsouthern-winterlaunch",
      status: "accepted",
      validUntil: "2026-07-18",
      createdAt: "2026-06-18T08:30:00+10:00",
    },
    [
      { productId: "prod-chill-pills", productName: "Chill Pills", quantity: 100, unitPrice: 18 },
      { productId: "prod-bs-blockers", productName: "Bullshit Blockers", quantity: 100, unitPrice: 18 },
      { productId: "prod-fart-suppressants", productName: "Fart Suppressants", quantity: 80, unitPrice: 18 },
      { productId: "prod-over-the-hill", productName: "Over The Hill Pills", quantity: 40, unitPrice: 18 },
    ]
  ),
  buildQuote(
    {
      id: "quote-041",
      quoteNumber: "SD-Q-2026-041",
      companyId: "co-harbour-city",
      opportunityId: "opp-harbourcity-xmas",
      status: "sent",
      validUntil: "2026-08-10",
      createdAt: "2026-07-10T09:20:00+12:00",
    },
    [
      { productId: "prod-you-rock", productName: "You Rock", quantity: 150, unitPrice: 18 },
      { productId: "prod-bear-hugs", productName: "Bear Hugs", quantity: 150, unitPrice: 18 },
      { productId: "prod-chill-pills", productName: "Chill Pills", quantity: 100, unitPrice: 18 },
      { productId: "prod-dad-joke", productName: "Dad Joke Enhancers", quantity: 50, unitPrice: 18 },
    ]
  ),
  buildQuote(
    {
      id: "quote-042",
      quoteNumber: "SD-Q-2026-042",
      companyId: "co-paper-twine",
      opportunityId: "opp-paperandtwine-mothers",
      status: "sent",
      validUntil: "2026-08-05",
      createdAt: "2026-07-05T10:00:00+12:00",
    },
    [
      { productId: "prod-you-rock", productName: "You Rock", quantity: 20, unitPrice: 18 },
      { productId: "prod-bear-hugs", productName: "Bear Hugs", quantity: 20, unitPrice: 18 },
      { productId: "prod-senior-moment", productName: "Senior Moment Suppressants", quantity: 10, unitPrice: 18 },
    ]
  ),
  buildQuote(
    {
      id: "quote-043",
      quoteNumber: "SD-Q-2026-043",
      companyId: "co-bondi-tech",
      opportunityId: "opp-bondi-welcome",
      status: "draft",
      validUntil: "2026-08-25",
      createdAt: "2026-07-11T12:10:00+10:00",
    },
    [
      { productId: "prod-bear-hugs", productName: "Bear Hugs", quantity: 40, unitPrice: 18 },
      { productId: "prod-you-rock", productName: "You Rock", quantity: 40, unitPrice: 18 },
      { productId: "prod-chill-pills", productName: "Chill Pills", quantity: 20, unitPrice: 18 },
    ]
  ),
];

export function getQuotesByCompanyId(companyId: string) {
  return quotes.filter((quote) => quote.companyId === companyId);
}

export function getQuoteByOpportunityId(opportunityId: string) {
  return quotes.find((quote) => quote.opportunityId === opportunityId);
}

export const quoteStatusLabels: Record<Quote["status"], string> = {
  draft: "Draft",
  sent: "Awaiting response",
  accepted: "Accepted",
  declined: "Declined",
};
