import type { DocumentCategory } from "./categories";
import type { FileType } from "./file-types";

export type DocumentSyncStatus = "synced" | "pending" | "error" | "deleted";

export interface KnowledgeFolder {
  id: string;
  externalId: string;
  parentId: string | null;
  name: string;
  path: string;
  category: DocumentCategory;
}

export interface KnowledgeDocument {
  id: string;
  externalId: string;
  folderId: string | null;
  name: string;
  category: DocumentCategory;
  fileType: FileType;
  url: string;
  ownerName: string;
  lastModifiedAt: string;
  syncStatus: DocumentSyncStatus;
}

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  /** 0–1, higher is a better match. Keyword search today, cosine similarity once embeddings land. */
  score: number;
  /** The matched snippet, when available (keyword search highlights; RAG will return a passage). */
  snippet?: string;
}
