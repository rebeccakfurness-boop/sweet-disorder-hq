export type FileType = "doc" | "sheet" | "slide" | "pdf" | "image" | "video" | "folder" | "other";

const MIME_MATCHERS: Array<{ test: (mimeType: string) => boolean; type: FileType }> = [
  { test: (m) => m === "application/vnd.google-apps.folder", type: "folder" },
  { test: (m) => m === "application/vnd.google-apps.document", type: "doc" },
  { test: (m) => m === "application/vnd.google-apps.spreadsheet", type: "sheet" },
  { test: (m) => m === "application/vnd.google-apps.presentation", type: "slide" },
  { test: (m) => m === "application/pdf", type: "pdf" },
  { test: (m) => m.startsWith("image/"), type: "image" },
  { test: (m) => m.startsWith("video/"), type: "video" },
];

export function mapMimeTypeToFileType(mimeType: string): FileType {
  return MIME_MATCHERS.find((entry) => entry.test(mimeType))?.type ?? "other";
}
