import { listDocuments } from "./repository";
import type { DocumentCategory } from "./categories";
import type { KnowledgeSearchResult } from "./types";

export interface SearchFilters {
  category?: DocumentCategory;
  integrationId?: string;
}

export interface SearchService {
  search(query: string, filters?: SearchFilters): Promise<KnowledgeSearchResult[]>;
}

/**
 * Postgres ILIKE-based keyword search — the whole "search" story for now.
 * It exists mainly to keep the API/UI contract stable: once embeddings
 * exist, `VectorSearchService` implements this same `SearchService`
 * interface and swaps in behind `getSearchService()` with no caller changes
 * in `app/api/knowledge` or the Knowledge Hub UI.
 */
export class KeywordSearchService implements SearchService {
  async search(query: string, filters: SearchFilters = {}): Promise<KnowledgeSearchResult[]> {
    if (!query.trim()) return [];

    const results = await listDocuments({ ...filters, query });
    const lowerQuery = query.toLowerCase();

    return results.map((document) => ({
      document,
      score: document.name.toLowerCase().includes(lowerQuery) ? 1 : 0.6,
    }));
  }
}

export function getSearchService(): SearchService {
  return new KeywordSearchService();
}

/**
 * Placeholder for the future RAG retrieval step: embed `query`, run an ANN
 * search over `document_chunks.embedding` (pgvector), return the top
 * passages for an AI assistant to ground its answer in.
 *
 * Not implemented — wire this up once an embedding pipeline exists.
 * `document_chunks.embedding` is already reserved for this
 * (see src/db/schema/custom-types.ts), so this becomes a new function body,
 * not a schema migration.
 */
export async function getRelevantChunksForQuery(query: string, limit = 5): Promise<never> {
  void query;
  void limit;
  throw new Error(
    "Semantic search is not implemented yet — see getRelevantChunksForQuery in src/lib/knowledge/search-service.ts."
  );
}
