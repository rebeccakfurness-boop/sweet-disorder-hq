import { documentCategories, type DocumentCategory } from "./categories";

export type RoleName = "production_staff" | "manager" | "admin";

export const roleLabels: Record<RoleName, string> = {
  production_staff: "Production Staff",
  manager: "Manager",
  admin: "Admin",
};

export type AccessLevel = "none" | "view" | "edit";

const allCategoriesAt = (level: AccessLevel): Record<DocumentCategory, AccessLevel> =>
  Object.fromEntries(documentCategories.map((category) => [category, level])) as Record<
    DocumentCategory,
    AccessLevel
  >;

/**
 * Default RBAC matrix, used until `role_category_access` (db/schema/auth.ts)
 * is seeded in a real database. This is the fallback, not a cache of the
 * DB — `getAccessLevel` should be swapped to a DB-backed lookup once roles
 * are actually assigned to signed-in users.
 */
const DEFAULT_ROLE_CATEGORY_ACCESS: Record<RoleName, Partial<Record<DocumentCategory, AccessLevel>>> = {
  production_staff: {
    production: "view",
    operations: "view",
    troubleshooting: "view",
    checklist: "view",
    template: "view",
  },
  manager: allCategoriesAt("view"),
  admin: allCategoriesAt("edit"),
};

export function getAccessLevel(role: RoleName, category: DocumentCategory): AccessLevel {
  return DEFAULT_ROLE_CATEGORY_ACCESS[role]?.[category] ?? "none";
}

export function canAccessCategory(role: RoleName, category: DocumentCategory): boolean {
  return getAccessLevel(role, category) !== "none";
}

export function getAccessibleCategories(role: RoleName): DocumentCategory[] {
  return documentCategories.filter((category) => canAccessCategory(role, category));
}
