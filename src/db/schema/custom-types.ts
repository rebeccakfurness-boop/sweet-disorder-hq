import { customType } from "drizzle-orm/pg-core";

/**
 * pgvector column type for future semantic search / RAG.
 *
 * Requires the `pgvector` Postgres extension on the real database:
 *   CREATE EXTENSION IF NOT EXISTS vector;
 *
 * Not used for querying yet (no ANN index, no embedding writer) — this just
 * reserves the column so `document_chunks.embedding` doesn't require a
 * migration + backfill later when semantic search is built. Until then the
 * column stays null and search runs on Postgres full-text search instead
 * (see `src/lib/knowledge/search-service.ts`).
 */
export function vector(name: string, dimensions: number) {
  return customType<{ data: number[]; driverData: string }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
      return value
        .slice(1, -1)
        .split(",")
        .filter(Boolean)
        .map(Number);
    },
  })(name);
}
