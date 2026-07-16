"use client";

import { useState } from "react";
import { AlertTriangle, Info, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { WholesaleOrderLine, WholesaleOrderRecord, WholesaleOrderStatus } from "@/lib/wholesale-orders/types";

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function formatMoney(amount: number, currency: "NZD" | "AUD"): string {
  return new Intl.NumberFormat(currency === "NZD" ? "en-NZ" : "en-AU", {
    style: "currency",
    currency,
  }).format(amount);
}

const statusLabels: Record<WholesaleOrderStatus, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  sent_to_xero: "Sent to Xero",
  error: "Error",
};

const statusVariants: Record<WholesaleOrderStatus, "muted" | "mint" | "default" | "destructive"> = {
  pending_review: "muted",
  approved: "mint",
  sent_to_xero: "default",
  error: "destructive",
};

export function OrderReview({ order: initialOrder }: { order: WholesaleOrderRecord }) {
  const [storeName, setStoreName] = useState(initialOrder.storeName ?? "");
  const [contactPerson, setContactPerson] = useState(initialOrder.contactPerson ?? "");
  const [contactEmail, setContactEmail] = useState(initialOrder.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initialOrder.contactPhone ?? "");
  const [address, setAddress] = useState(initialOrder.address ?? "");
  const [orderRequiredDate, setOrderRequiredDate] = useState(initialOrder.orderRequiredDate ?? "");
  const [additionalNotes, setAdditionalNotes] = useState(initialOrder.additionalNotes ?? "");
  const [lineItems, setLineItems] = useState<WholesaleOrderLine[]>(initialOrder.lineItems);
  const [status, setStatus] = useState<WholesaleOrderStatus>(initialOrder.status);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveNote, setSaveNote] = useState<string | null>(null);

  const persisted = initialOrder.id !== null;
  const currency = initialOrder.region === "NZ" ? "NZD" : "AUD";
  const hasLowConfidence = lineItems.some((line) => line.confidence === "low");
  const total = lineItems.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

  function updateLine(index: number, patch: Partial<WholesaleOrderLine>) {
    setLineItems((prev) =>
      prev.map((line, i) => (i === index ? { ...line, ...patch, confidence: "high" } : line))
    );
  }

  async function handleSave(nextStatus?: WholesaleOrderStatus) {
    setSaving(true);
    setSaveError(null);
    setSaveNote(null);

    const patch = {
      storeName: emptyToNull(storeName),
      contactPerson: emptyToNull(contactPerson),
      contactEmail: emptyToNull(contactEmail),
      contactPhone: emptyToNull(contactPhone),
      address: emptyToNull(address),
      orderRequiredDate: emptyToNull(orderRequiredDate),
      additionalNotes: emptyToNull(additionalNotes),
      lineItems,
      ...(nextStatus ? { status: nextStatus } : {}),
    };

    if (!persisted) {
      if (nextStatus) setStatus(nextStatus);
      const action = nextStatus === "approved" ? "Order approved" : "Changes kept";
      setSaveNote(`${action} — not saved to a database, so this only exists in this browser session.`);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/wholesale-orders/${initialOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? "Failed to save changes.");
        return;
      }
      setStatus(data.order.status);
      setSaveNote(nextStatus === "approved" ? "Order approved." : "Changes saved.");
    } catch {
      setSaveError("Couldn't reach the server — check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {!persisted ? (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Not connected to a database yet — edits and approval exist only in this browser session.</p>
        </div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Store Details</CardTitle>
          <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <EditableField label="Store Name" value={storeName} onChange={setStoreName} />
          <EditableField label="Contact Person" value={contactPerson} onChange={setContactPerson} />
          <EditableField label="Email" value={contactEmail} onChange={setContactEmail} />
          <EditableField label="Phone" value={contactPhone} onChange={setContactPhone} />
          <EditableField label="Address" value={address} onChange={setAddress} />
          <EditableField label="Order Required Date" value={orderRequiredDate} onChange={setOrderRequiredDate} />
          <div className="sm:col-span-2">
            <EditableField label="Additional Notes" value={additionalNotes} onChange={setAdditionalNotes} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            Order Lines
            <Badge variant="muted">{lineItems.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Line Total</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((line, index) => (
                <TableRow
                  key={index}
                  className={cn(line.confidence === "low" && "border-l-2 border-l-mustard bg-mustard/10")}
                >
                  <TableCell>
                    <Input
                      value={line.itemCode ?? ""}
                      onChange={(e) => updateLine(index, { itemCode: emptyToNull(e.target.value) })}
                      className="h-8 w-24 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={line.productDescription}
                      onChange={(e) => updateLine(index, { productDescription: e.target.value })}
                      className="h-8 min-w-40 text-sm"
                    />
                    {line.confidence === "low" && line.rawText ? (
                      <div className="mt-1 flex items-start gap-1 text-xs text-mustard-foreground">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>Flagged for review — read as &ldquo;{line.rawText}&rdquo;</span>
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={line.variant}
                      onChange={(e) => updateLine(index, { variant: e.target.value })}
                      className="h-8 w-24 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => updateLine(index, { quantity: Number(e.target.value) || 0 })}
                      className="h-8 w-20 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.unitPrice}
                      onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) || 0 })}
                      className="h-8 w-24 text-sm"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {formatMoney(line.quantity * line.unitPrice, currency)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={line.confidence === "high" ? "mint" : "mustard"}>
                      {line.confidence === "high" ? "High" : "Needs review"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end border-t border-border px-4 py-3 text-sm font-medium text-foreground">
            Total: {formatMoney(total, currency)}
          </div>
        </CardContent>
      </Card>

      {saveError ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>{saveError}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={() => handleSave()} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save changes
        </Button>
        <Button
          type="button"
          onClick={() => handleSave("approved")}
          disabled={saving || hasLowConfidence || status === "approved"}
          className="gap-1.5"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Approve order
        </Button>
        {hasLowConfidence && status !== "approved" ? (
          <span className="text-sm text-mustard-foreground">
            Resolve every flagged row before approving.
          </span>
        ) : null}
        {saveNote && !saveError ? <span className="text-sm text-muted-foreground">{saveNote}</span> : null}
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
    </div>
  );
}
