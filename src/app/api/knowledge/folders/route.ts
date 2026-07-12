import { NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/db";
import { listFolders } from "@/lib/knowledge/repository";
import { mockKnowledgeFolders } from "@/lib/knowledge/mock";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, folders: mockKnowledgeFolders });
  }

  const folders = await listFolders();
  return NextResponse.json({ configured: true, folders });
}
