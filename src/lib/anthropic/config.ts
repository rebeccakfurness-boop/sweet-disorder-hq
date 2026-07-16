// Central place for the Anthropic API key — same pattern as
// src/lib/google/config.ts. Every other file under src/lib/anthropic reads
// config through here rather than process.env directly.
export const anthropicConfig = {
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
  model: "claude-sonnet-5",
};

export function isAnthropicConfigured(): boolean {
  return Boolean(anthropicConfig.apiKey);
}
