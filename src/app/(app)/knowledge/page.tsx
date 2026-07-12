import { Info } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { CategorySection } from "@/components/knowledge/category-section";
import { KnowledgeSearch } from "@/components/knowledge/knowledge-search";
import { mockKnowledgeFolders, mockKnowledgeDocuments } from "@/lib/knowledge/mock";

export default function KnowledgeHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Hub"
        description="SOPs, policies, and guides — synced straight from Google Drive."
      />

      <KnowledgeSearch />

      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Not connected to Google Drive yet — this is sample content shaped exactly like what will appear
          once a Drive folder is connected in Integrations. Nothing here is stored outside Drive; Project HQ
          only keeps a synced reference and a link back to the original file.
        </p>
      </div>

      <div className="space-y-4">
        {mockKnowledgeFolders.map((folder) => (
          <CategorySection
            key={folder.id}
            title={folder.name}
            documents={mockKnowledgeDocuments.filter((doc) => doc.folderId === folder.id)}
          />
        ))}
      </div>
    </div>
  );
}
