import Anthropic from "@anthropic-ai/sdk";

import { anthropicConfig, isAnthropicConfigured } from "./config";

export function createAnthropicClient(): Anthropic {
  if (!isAnthropicConfigured()) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }
  return new Anthropic({ apiKey: anthropicConfig.apiKey });
}
