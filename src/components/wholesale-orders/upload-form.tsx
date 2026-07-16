"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, AlertTriangle, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderReview } from "@/components/wholesale-orders/order-review";
import type { WholesaleOrderRecord, WholesaleOrderRegion } from "@/lib/wholesale-orders/types";

type ReadStatus = "idle" | "reading" | "done" | "error";

export function WholesaleOrderUploadForm() {
  const [region, setRegion] = useState<WholesaleOrderRegion | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ReadStatus>("idle");
  const [order, setOrder] = useState<WholesaleOrderRecord | null>(null);
  const [aiConfigured, setAiConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  function resetResults() {
    setStatus("idle");
    setOrder(null);
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

      setAiConfigured(Boolean(data.aiConfigured));
      setOrder(data.order as WholesaleOrderRecord);
      setStatus("done");
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
      setStatus("error");
    }
  }

  const canRead = Boolean(region && photoFile) && status !== "reading";

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

      {status === "done" && order ? (
        <div className="space-y-4">
          {!aiConfigured ? (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Not connected to the Anthropic API yet — this is sample extraction shaped exactly like what a real
                photo will produce once ANTHROPIC_API_KEY is set.
              </p>
            </div>
          ) : null}

          <OrderReview key={order.id ?? order.createdAt} order={order} />
        </div>
      ) : null}
    </div>
  );
}
