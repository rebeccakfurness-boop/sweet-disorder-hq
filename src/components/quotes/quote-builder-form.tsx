"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Printer, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuotePreview } from "@/components/quotes/quote-preview";
import { companies, getCompanyById, getContactsByCompanyId } from "@/lib/mock/companies";
import { getOpportunitiesByCompanyId } from "@/lib/mock/opportunities";
import { products, getProductById } from "@/lib/mock/products";
import { discountTiers, getDiscountTierForQuantity } from "@/lib/pricing";
import { cn, formatCurrencyNZD } from "@/lib/utils";
import type { QuoteLineItem } from "@/lib/types";

type DraftLineItem = QuoteLineItem;

let lineItemCounter = 0;
function nextLineItemId() {
  lineItemCounter += 1;
  return `draft-li-${lineItemCounter}`;
}

export function QuoteBuilderForm({
  defaultCompanyId,
  defaultOpportunityId,
}: {
  defaultCompanyId?: string;
  defaultOpportunityId?: string;
}) {
  const [companyId, setCompanyId] = useState(defaultCompanyId ?? companies[0]?.id);
  const [opportunityId, setOpportunityId] = useState(defaultOpportunityId ?? "");
  const [lineItems, setLineItems] = useState<DraftLineItem[]>([
    {
      id: nextLineItemId(),
      productId: products[0].id,
      productName: products[0].name,
      quantity: 10,
      unitPrice: products[0].basePrice,
    },
  ]);
  const [isPreview, setIsPreview] = useState(false);

  const opportunitiesForCompany = companyId ? getOpportunitiesByCompanyId(companyId) : [];
  const company = getCompanyById(companyId ?? "");
  const contacts = companyId ? getContactsByCompanyId(companyId) : [];
  const primaryContact = contacts.find((c) => c.isPrimary) ?? contacts[0];

  const totals = useMemo(() => {
    const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tier = getDiscountTierForQuantity(totalQuantity);
    const discountAmount = subtotal * (tier.discountPercent / 100);
    const total = subtotal - discountAmount;
    return { totalQuantity, subtotal, discountAmount, total, tier };
  }, [lineItems]);

  function addLineItem() {
    const product = products[0];
    setLineItems((prev) => [
      ...prev,
      { id: nextLineItemId(), productId: product.id, productName: product.name, quantity: 10, unitPrice: product.basePrice },
    ]);
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateLineItem(id: string, patch: Partial<DraftLineItem>) {
    setLineItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function handleProductChange(id: string, productId: string) {
    const product = getProductById(productId);
    if (!product) return;
    updateLineItem(id, { productId: product.id, productName: product.name, unitPrice: product.basePrice });
  }

  const canGenerate = Boolean(companyId) && lineItems.length > 0 && lineItems.every((i) => i.quantity > 0);

  if (isPreview) {
    const quoteNumber = `SD-Q-2026-${String(100 + Math.floor(Math.random() * 50)).padStart(3, "0")}`;
    return (
      <div>
        <div className="mb-6 flex items-center justify-between print:hidden">
          <button
            onClick={() => setIsPreview(false)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to edit
          </button>
          <Button onClick={() => window.print()} className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>
        <QuotePreview
          data={{
            quoteNumber,
            company,
            contactName: primaryContact?.name,
            lineItems,
            subtotal: totals.subtotal,
            discountPercent: totals.tier.discountPercent,
            total: totals.total,
            createdAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Company & opportunity</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select value={companyId} onValueChange={(value) => { setCompanyId(value); setOpportunityId(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Linked opportunity (optional)</Label>
              <Select value={opportunityId || "none"} onValueChange={(v) => setOpportunityId(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {opportunitiesForCompany.map((opp) => (
                    <SelectItem key={opp.id} value={opp.id}>
                      {opp.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Line items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 items-end gap-2 rounded-lg border border-border p-3">
                <div className="col-span-12 space-y-1.5 sm:col-span-5">
                  <Label className="text-xs text-muted-foreground">Product</Label>
                  <Select value={item.productId} onValueChange={(value) => handleProductChange(item.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, { quantity: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-4 space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Unit price</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.5"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-3 space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Total</Label>
                  <p className="flex h-9 items-center text-sm font-medium text-foreground">
                    {formatCurrencyNZD(item.quantity * item.unitPrice)}
                  </p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    aria-label="Remove line item"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addLineItem} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add line item
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Total units</span>
              <span className="text-foreground">{totals.totalQuantity}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatCurrencyNZD(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-mint">
              <span>Bulk discount ({totals.tier.discountPercent}%)</span>
              <span>-{formatCurrencyNZD(totals.discountAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
              <span>Total (NZD)</span>
              <span>{formatCurrencyNZD(totals.total)}</span>
            </div>

            <Button
              className="w-full"
              disabled={!canGenerate}
              onClick={() => setIsPreview(true)}
            >
              Generate Quote
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Corporate discount tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {discountTiers.map((tier) => (
              <div
                key={tier.label}
                className={cn(
                  "flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm",
                  tier.label === totals.tier.label ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
              >
                <span>{tier.label}</span>
                <span className="font-medium">{tier.discountPercent === 0 ? "Standard price" : `${tier.discountPercent}% off`}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
