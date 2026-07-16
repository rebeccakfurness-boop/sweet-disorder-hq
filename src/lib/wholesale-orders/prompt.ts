import type { CatalogEntry } from "./catalog";

const SYSTEM_PROMPT_TEMPLATE = `You are extracting a wholesale order from a photograph of a handwritten paper order form for Sweet Disorder, a NZ/AU novelty candy brand.

You will be given:
1. A photo of a filled-in order form.
2. A JSON list of valid products for this region, each with itemCode, description, variant, and unitPrice.

Your job:
- Read the store details section (store name, contact person, address, phone, email, order required date, additional notes) exactly as written. If a field is blank or illegible, return null for it — do not guess.
- For every row with a handwritten quantity in the "ORDER QTY" column, match it to the closest product in the provided catalog by description and variant. Use the catalog's itemCode and unitPrice — do not invent prices.
- If a quantity is present but you cannot confidently match the row to a catalog product, or the handwriting is ambiguous, still include the line with itemCode: null and confidence: "low", and put your best reading of the handwriting in rawText.
- Ignore rows with no quantity written in.
- Never round or estimate a quantity — if you cannot read a digit clearly, mark that line low confidence rather than guessing.

Return ONLY valid JSON matching this exact shape, no other text:
{
  "storeName": string | null,
  "contactPerson": string | null,
  "contactEmail": string | null,
  "contactPhone": string | null,
  "address": string | null,
  "orderRequiredDate": string | null,
  "additionalNotes": string | null,
  "lineItems": [
    {
      "itemCode": string | null,
      "productDescription": string,
      "variant": string,
      "quantity": number,
      "unitPrice": number,
      "confidence": "high" | "low",
      "rawText": string | null
    }
  ]
}

Product catalog for this region:
{{PRODUCT_CATALOG_JSON}}`;

export function buildSystemPrompt(catalog: CatalogEntry[]): string {
  return SYSTEM_PROMPT_TEMPLATE.replace("{{PRODUCT_CATALOG_JSON}}", JSON.stringify(catalog));
}
