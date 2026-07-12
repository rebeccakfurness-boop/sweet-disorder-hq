export type DocumentCategory =
  | "production"
  | "hr"
  | "marketing"
  | "finance"
  | "operations"
  | "supplier"
  | "training"
  | "policy"
  | "template"
  | "checklist"
  | "form"
  | "troubleshooting"
  | "uncategorized";

export const documentCategories: DocumentCategory[] = [
  "production",
  "hr",
  "marketing",
  "finance",
  "operations",
  "supplier",
  "training",
  "policy",
  "template",
  "checklist",
  "form",
  "troubleshooting",
  "uncategorized",
];

export const categoryLabels: Record<DocumentCategory, string> = {
  production: "Production",
  hr: "HR",
  marketing: "Marketing",
  finance: "Finance",
  operations: "Operations",
  supplier: "Supplier",
  training: "Training",
  policy: "Policy",
  template: "Template",
  checklist: "Checklist",
  form: "Form",
  troubleshooting: "Troubleshooting",
  uncategorized: "Uncategorized",
};

// Maps a top-level Drive folder name (case-insensitive) to a category.
// Anything not listed falls back to "uncategorized" rather than guessing —
// better to land in an obvious catch-all bucket on first sync than be
// silently filed under the wrong RBAC category.
const TOP_LEVEL_FOLDER_TO_CATEGORY: Record<string, DocumentCategory> = {
  production: "production",
  hr: "hr",
  "human resources": "hr",
  marketing: "marketing",
  finance: "finance",
  operations: "operations",
  suppliers: "supplier",
  supplier: "supplier",
  training: "training",
  policies: "policy",
  templates: "template",
  checklists: "checklist",
  forms: "form",
  troubleshooting: "troubleshooting",
};

export function categoryFromTopLevelFolderName(name: string): DocumentCategory {
  return TOP_LEVEL_FOLDER_TO_CATEGORY[name.trim().toLowerCase()] ?? "uncategorized";
}

export interface FolderLike {
  externalId: string;
  name: string;
  parentExternalId: string | null;
}

export interface FolderResolution {
  path: string;
  category: DocumentCategory;
}

/**
 * Builds externalId -> { path, category } for every folder in `folders`,
 * given `rootExternalId` (the connected Drive root — not itself a row in
 * `document_folders`). Category is inherited from the top-level folder (the
 * one whose parent is the root), so a document ten levels deep in
 * "Production / SOPs / Archive / 2024" still resolves to "production".
 */
export function buildFolderPathIndex(
  folders: FolderLike[],
  rootExternalId: string
): Map<string, FolderResolution> {
  const byExternalId = new Map(folders.map((folder) => [folder.externalId, folder]));
  const resolved = new Map<string, FolderResolution>();

  function resolve(externalId: string): FolderResolution {
    const cached = resolved.get(externalId);
    if (cached) return cached;

    const folder = byExternalId.get(externalId);
    if (!folder) {
      const fallback: FolderResolution = { path: "Unknown", category: "uncategorized" };
      resolved.set(externalId, fallback);
      return fallback;
    }

    if (!folder.parentExternalId || folder.parentExternalId === rootExternalId) {
      const result: FolderResolution = {
        path: folder.name,
        category: categoryFromTopLevelFolderName(folder.name),
      };
      resolved.set(externalId, result);
      return result;
    }

    const parent = resolve(folder.parentExternalId);
    const result: FolderResolution = { path: `${parent.path} / ${folder.name}`, category: parent.category };
    resolved.set(externalId, result);
    return result;
  }

  for (const folder of folders) resolve(folder.externalId);
  return resolved;
}
