import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { isAnthropicConfigured } from "@/lib/anthropic/config";
import { mockWholesaleOrderExtractionByRegion } from "@/lib/wholesale-orders/mock";
import { createStagedOrder } from "@/lib/wholesale-orders/repository";
import {
  MAX_IMAGE_BYTES,
  WholesaleOrderReadError,
  isSupportedImageType,
  readOrderFromPhoto,
} from "@/lib/wholesale-orders/read-order";
import type { WholesaleOrderExtraction, WholesaleOrderRecord, WholesaleOrderRegion } from "@/lib/wholesale-orders/types";

function isWholesaleOrderRegion(value: FormDataEntryValue | null): value is WholesaleOrderRegion {
  return value === "NZ" || value === "AUS";
}

// Used when there's no database to persist to — the review UI gets a
// record-shaped object either way, it just can't survive a page reload.
function ephemeralRecord(region: WholesaleOrderRegion, extraction: WholesaleOrderExtraction): WholesaleOrderRecord {
  return {
    ...extraction,
    id: null,
    region,
    photoUrl: null,
    status: "pending_review",
    xeroQuoteId: null,
    xeroQuoteUrl: null,
    createdAt: new Date().toISOString(),
    reviewedBy: null,
  };
}

/** Reads a photographed wholesale order form, extracts it, and stages it for review. */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const region = form.get("region");
  if (!isWholesaleOrderRegion(region)) {
    return NextResponse.json({ error: 'region must be "NZ" or "AUS".' }, { status: 400 });
  }

  const photo = form.get("photo");
  if (!(photo instanceof Blob) || photo.size === 0) {
    return NextResponse.json({ error: "No photo was uploaded." }, { status: 400 });
  }
  if (photo.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: `Photo is too large (max ${Math.floor(MAX_IMAGE_BYTES / (1024 * 1024))}MB) — try a smaller photo.` },
      { status: 413 }
    );
  }
  const mediaType = photo.type;
  if (!isSupportedImageType(mediaType)) {
    return NextResponse.json(
      { error: "Unsupported image type — please use JPEG, PNG, GIF, or WEBP." },
      { status: 400 }
    );
  }

  let extraction: WholesaleOrderExtraction;
  const aiConfigured = isAnthropicConfigured();

  if (!aiConfigured) {
    extraction = mockWholesaleOrderExtractionByRegion[region];
  } else {
    try {
      const buffer = Buffer.from(await photo.arrayBuffer());
      extraction = await readOrderFromPhoto({ region, imageBase64: buffer.toString("base64"), mediaType });
    } catch (error) {
      if (error instanceof WholesaleOrderReadError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      const message = error instanceof Error ? error.message : "Failed to read the order form.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ aiConfigured, persisted: false, order: ephemeralRecord(region, extraction) });
  }

  const order = await createStagedOrder(region, extraction);
  return NextResponse.json({ aiConfigured, persisted: true, order });
}
