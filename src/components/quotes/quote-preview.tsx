import { LogoMark } from "@/components/shared/logo";
import type { Company, QuoteLineItem } from "@/lib/types";
import { formatCurrencyNZD, formatDate } from "@/lib/utils";

export interface QuotePreviewData {
  quoteNumber: string;
  company: Company | undefined;
  contactName?: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  discountPercent: number;
  total: number;
  createdAt: string;
  validUntil: string;
}

export function QuotePreview({ data }: { data: QuotePreviewData }) {
  const discountAmount = data.subtotal * (data.discountPercent / 100);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 shadow-popover print:rounded-none print:border-none print:p-0 print:shadow-none">
      <div className="flex items-start justify-between border-b border-dashed border-border pb-6">
        <div className="flex items-center gap-3">
          <LogoMark size={56} />
          <div>
            <p className="text-xs text-muted-foreground">Prescribing fun gifts for everyone</p>
            <p className="mt-1 text-xs text-muted-foreground">Silverdale, Auckland · sweetdisorder.co.nz</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Rx / Quote</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{data.quoteNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground">Issued {formatDate(data.createdAt)}</p>
          <p className="text-xs text-muted-foreground">Valid until {formatDate(data.validUntil)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 py-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prescribed for</p>
          <p className="mt-1 text-sm font-medium text-foreground">{data.company?.name ?? "—"}</p>
          {data.contactName ? <p className="text-sm text-muted-foreground">{data.contactName}</p> : null}
          <p className="text-sm text-muted-foreground">
            {data.company ? `${data.company.region}, ${data.company.country}` : null}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prescribed by</p>
          <p className="mt-1 text-sm font-medium text-foreground">Molly Hansen</p>
          <p className="text-sm text-muted-foreground">Chief Dream Officer, Sweet Disorder</p>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-2 font-medium">Prescription</th>
            <th className="py-2 text-right font-medium">Qty</th>
            <th className="py-2 text-right font-medium">Unit Price</th>
            <th className="py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-border/60">
              <td className="py-2.5 font-medium text-foreground">{item.productName}</td>
              <td className="py-2.5 text-right text-muted-foreground">{item.quantity}</td>
              <td className="py-2.5 text-right text-muted-foreground">
                {formatCurrencyNZD(item.unitPrice)}
              </td>
              <td className="py-2.5 text-right font-medium text-foreground">
                {formatCurrencyNZD(item.quantity * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto mt-4 w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrencyNZD(data.subtotal)}</span>
        </div>
        {data.discountPercent > 0 ? (
          <div className="flex justify-between text-mint">
            <span>Bulk discount ({data.discountPercent}%)</span>
            <span>-{formatCurrencyNZD(discountAmount)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-foreground">
          <span>Total (NZD)</span>
          <span>{formatCurrencyNZD(data.total)}</span>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        Every Sweet Disorder order helps fund mental health causes across Aotearoa — this quote is no
        exception. Prices in NZD, exclusive of freight. No refunds on joy delivered.
      </div>
    </div>
  );
}
