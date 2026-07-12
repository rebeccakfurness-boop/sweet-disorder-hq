"use client";

import { useState } from "react";
import { Search, ExternalLink, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTypeIcon } from "@/components/knowledge/file-type-icon";
import { categoryLabels } from "@/lib/knowledge/categories";
import type { KnowledgeSearchResult } from "@/lib/knowledge/types";
import { formatDate } from "@/lib/utils";

export function KnowledgeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KnowledgeSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
        <Input
          value={query}
          onChange={(e) => runSearch(e.target.value)}
          placeholder='Ask "How do I change labels on the OKI printer?"'
          className="pl-9 pr-9"
        />
      </div>

      {results ? (
        <Card className="mt-3">
          <CardContent className="space-y-1 p-2">
            {results.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No documents match &ldquo;{query}&rdquo; yet.
              </p>
            ) : (
              results.map(({ document, score }) => (
                <a
                  key={document.id}
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileTypeIcon fileType={document.fileType} className="shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{document.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {categoryLabels[document.category]} · Updated {formatDate(document.lastModifiedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {score >= 1 ? <Badge variant="mint">Name match</Badge> : null}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </a>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
