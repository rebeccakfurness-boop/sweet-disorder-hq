import { NextRequest, NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { listDocuments } from "@/lib/knowledge/repository";
import { mockKnowledgeDocuments } from "@/lib/knowledge/mock";
import type { DocumentCategory } from "@/lib/knowledge/categories";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") as DocumentCategory | null;
  const folderId = request.nextUrl.searchParams.get("folderId");

  if (!isDatabaseConfigured()) {
    // No live Drive connection yet — serve the same fixtures the UI already
    // renders, filtered the same way a real query would be, so this route is
    // already a drop-in replacement for the mock data layer.
    const documents = mockKnowledgeDocuments.filter(
      (doc) => (!category || doc.category === category) && (!folderId || doc.folderId === folderId)
    );
    return NextResponse.json({ configured: false, documents });
  }

  const documents = await listDocuments({
    category: category ?? undefined,
    folderId: folderId ?? undefined,
  });
  return NextResponse.json({ configured: true, documents });
}
