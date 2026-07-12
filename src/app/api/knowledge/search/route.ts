import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { getSearchService } from "@/lib/knowledge/search-service";
import { mockKnowledgeDocuments } from "@/lib/knowledge/mock";

// Keyword search today (see src/lib/knowledge/search-service.ts). The
// response shape (`{ document, score }[]`) is what a future semantic search
// will return too, so the Knowledge Hub UI and any AI assistant integration
// built against this endpoint don't need to change when that lands.
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  if (!isDatabaseConfigured()) {
    const lowerQuery = query.toLowerCase();
    const results = mockKnowledgeDocuments
      .filter((doc) => doc.name.toLowerCase().includes(lowerQuery))
      .map((document) => ({ document, score: 1 }));
    return NextResponse.json({ configured: false, results });
  }

  const results = await getSearchService().search(query);
  return NextResponse.json({ configured: true, results });
}
