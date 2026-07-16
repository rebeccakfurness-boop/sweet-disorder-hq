"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { WholesaleOrderExtraction, WholesaleOrderRegion } from "@/lib/wholesale-orders/types";
import { cn } from "@/lib/utils";

type ReadStatus = "idle" | "reading" | "done" | "error";

function formatMoney(amount: number, region: WholesaleOrderRegion): string {
  return new Intl.NumberFormat(region === "NZ" ? "en-NZ" : "en-AU", {
    style: "currency",
    currency: region === "NZ" ? "NZD" : "AUD",
  }).format(amount);
}

export function WholesaleOrderUploadForm() {
  const [region, setRegion] = useState<WholesaleOrderRegion | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ReadStatus>("idle");
  const [extraction, setExtraction] = useState<WholesaleOrderExtraction | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  function resetResults() {
    setStatus("idle");
    setExtraction(null);
    setError(null);
  }

  function handleRegionSelect(next: WholesaleOrderRegion) {
    setRegion(next);
    resetResults();
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null);
    resetResults();
  }

  function handleRemovePhoto() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    resetResults();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleReadOrder() {
    if (!region || !photoFile) return;
    setStatus("reading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("region", region);
      formData.append("photo", photoFile);

      const res = await fetch("/api/wholesale-orders/read", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong reading this order.");
        setStatus("error");
        return;
      }

      const { configured: isConfigured, ...rest } = data;
      setConfigured(isConfigured !== false);
      setExtraction(rest as WholesaleOrderExtraction);
      setStatus("done");
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
      setStatus("error");
    }
  }

  const canRead = Boolean(region && photoFile) && status !== "reading";
  const total = extraction?.lineItems.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant={region === "NZ" ? "default" : "outline"}
          onClick={() => handleRegionSelect("NZ")}
        >
          New Zealand Order
        </Button>
        <Button
          type="button"
          variant={region === "AUS" ? "default" : "outline"}
          onClick={() => handleRegionSelect("AUS")}
        >
          Australia Order
        </Button>
      </div>
      {!region ? <p className="text-sm text-muted-foreground">Pick a region to get started.</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Order Form Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
              <Camera className="h-4 w-4" />
              {photoFile ? "Retake / choose photo" : "Take or choose photo"}
            </Button>
            {photoFile ? (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemovePhoto} className="gap-1.5">
                <X className="h-3.5 w-3.5" />
                Remove
              </Button>
            ) : null}
          </div>

          {photoPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreviewUrl}
              alt="Uploaded wholesale order form"
              className="max-h-96 w-full rounded-lg border border-border object-contain"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No photo selected yet.</p>
          )}

          <Button type="button" onClick={handleReadOrder} disabled={!canRead} className="gap-1.5">
            {status === "reading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Read order
          </Button>
        </CardContent>
      </Card>

      {status === "error" && error ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {status === "done" && extraction ? (
        <div className="space-y-4">
          {!configured ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Not connected to the Anthropic API yet — this is sample extraction shaped exactly like what a real
                photo will produce once ANTHROPIC_API_KEY is set.
              </p>
            </div>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Store Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <DetailField label="Store Name" value={extraction.storeName} />
              <DetailField label="Contact Person" value={extraction.contactPerson} />
              <DetailField label="Email" value={extraction.contactEmail} />
              <DetailField label="Phone" value={extraction.contactPhone} />
              <DetailField label="Address" value={extraction.address} />
              <DetailField label="Order Required Date" value={extraction.orderRequiredDate} />
              <div className="sm:col-span-2">
                <DetailField label="Additional Notes" value={extraction.additionalNotes} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-mint" />
                Extracted Order Lines
                <Badge variant="muted">{extraction.lineItems.length}</Badge>
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
                  {extraction.lineItems.map((line, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm text-muted-foreground">{line.itemCode ?? "—"}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">{line.productDescription}</div>
                        {line.confidence === "low" && line.rawText ? (
                          <div className="mt-0.5 flex items-start gap-1 text-xs text-mustard-foreground">
                            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>Flagged for review — read as &ldquo;{line.rawText}&rdquo;</span>
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{line.variant}</TableCell>
                      <TableCell className="text-sm text-foreground">{line.quantity}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatMoney(line.unitPrice, region!)}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {formatMoney(line.quantity * line.unitPrice, region!)}
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
              <div className={cn("flex justify-end border-t border-border px-4 py-3 text-sm font-medium text-foreground")}>
                Total: {formatMoney(total, region!)}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value ?? "—"}</div>
    </div>
  );
}
