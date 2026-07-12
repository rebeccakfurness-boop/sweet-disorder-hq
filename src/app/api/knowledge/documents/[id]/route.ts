import { NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { getDocumentById } from "@/lib/knowledge/repository";
import { mockKnowledgeDocuments } from "@/lib/knowledge/mock";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!isDatabaseConfigured()) {
    const document = mockKnowledgeDocuments.find((doc) => doc.id === params.id) ?? null;
    return NextResponse.json({ configured: false, document });
  }

  const document = await getDocumentById(params.id);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  return NextResponse.json({ configured: true, document });
}
