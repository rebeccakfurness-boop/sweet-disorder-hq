import Anthropic from "@anthropic-ai/sdk";

import { createAnthropicClient } from "@/lib/anthropic/client";
import { anthropicConfig } from "@/lib/anthropic/config";
import { loadCatalog } from "./catalog";
import { buildSystemPrompt } from "./prompt";
import type { WholesaleOrderExtraction, WholesaleOrderRegion } from "./types";

export class WholesaleOrderReadError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "WholesaleOrderReadError";
  }
}

// Kept well under Anthropic's per-image guidance and Vercel's ~4.5MB
// Serverless Function request body limit, so an oversized photo fails fast
// with a clear message rather than timing out mid-upload.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export function isSupportedImageType(type: string): type is SupportedImageType {
  return (SUPPORTED_IMAGE_TYPES as readonly string[]).includes(type);
}

export async function readOrderFromPhoto({
  region,
  imageBase64,
  mediaType,
}: {
  region: WholesaleOrderRegion;
  imageBase64: string;
  mediaType: SupportedImageType;
}): Promise<WholesaleOrderExtraction> {
  const catalog = await loadCatalog(region);
  const systemPrompt = buildSystemPrompt(catalog);
  const client = createAnthropicClient();

  let response;
  try {
    response = await client.messages.create({
      model: anthropicConfig.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
            { type: "text", text: "Extract the order from this photograph of a wholesale order form." },
          ],
        },
      ],
    });
  } catch (error) {
    throw mapAnthropicError(error);
  }

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  if (!textBlock) {
    throw new WholesaleOrderReadError("The AI response didn't include any text content.", 502);
  }

  return parseExtraction(textBlock.text);
}

function mapAnthropicError(error: unknown): WholesaleOrderReadError {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 429) {
      return new WholesaleOrderReadError(
        "Rate limited by the Anthropic API — please try again in a moment.",
        429
      );
    }
    if (error.status === 401 || error.status === 403) {
      return new WholesaleOrderReadError(
        "The Anthropic API rejected the request — check that ANTHROPIC_API_KEY is valid.",
        502
      );
    }
    return new WholesaleOrderReadError(`Anthropic API error: ${error.message}`, error.status ?? 502);
  }
  const message = error instanceof Error ? error.message : "Unknown error calling the Anthropic API.";
  return new WholesaleOrderReadError(message, 502);
}

function parseExtraction(text: string): WholesaleOrderExtraction {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonPayload(text));
  } catch {
    throw new WholesaleOrderReadError("The AI returned a response that wasn't valid JSON.", 502);
  }
  if (!isWholesaleOrderExtraction(parsed)) {
    throw new WholesaleOrderReadError(
      "The AI response didn't match the expected order shape.",
      502
    );
  }
  return parsed;
}

// The system prompt asks for raw JSON with "no other text", but strips an
// accidental ```json fence defensively in case a response ever wraps one.
function extractJsonPayload(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : trimmed;
}

function isWholesaleOrderExtraction(value: unknown): value is WholesaleOrderExtraction {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.lineItems)) return false;
  return record.lineItems.every((line) => {
    if (!line || typeof line !== "object") return false;
    const l = line as Record<string, unknown>;
    return (
      typeof l.productDescription === "string" &&
      typeof l.variant === "string" &&
      typeof l.quantity === "number" &&
      typeof l.unitPrice === "number" &&
      (l.confidence === "high" || l.confidence === "low")
    );
  });
}
