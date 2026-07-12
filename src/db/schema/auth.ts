import { pgTable, pgEnum, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { documentCategoryEnum } from "./knowledge";

// Groundwork only — nothing in the app authenticates against these tables
// yet (login is still a stub). Wiring this up later is additive: swap the
// login stub for a real session, look up the signed-in user's role, and
// every knowledge-hub query already knows how to filter by it.
export const roleNameEnum = pgEnum("role_name", ["production_staff", "manager", "admin"]);

export const accessLevelEnum = pgEnum("access_level", ["none", "view", "edit"]);

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: roleNameEnum("name").notNull(),
  description: text("description"),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    roleId: uuid("role_id").references(() => roles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

// The actual RBAC matrix: which document categories a role can see, and at
// what level. `src/lib/knowledge/permissions.ts` reads this (falling back to
// a hardcoded default matrix while the table is empty/unseeded).
export const roleCategoryAccess = pgTable(
  "role_category_access",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roleId: uuid("role_id")
      .references(() => roles.id, { onDelete: "cascade" })
      .notNull(),
    category: documentCategoryEnum("category").notNull(),
    accessLevel: accessLevelEnum("access_level").default("view").notNull(),
  },
  (table) => ({
    roleCategoryIdx: uniqueIndex("role_category_access_idx").on(table.roleId, table.category),
  })
);

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  categoryAccess: many(roleCategoryAccess),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
}));

export const roleCategoryAccessRelations = relations(roleCategoryAccess, ({ one }) => ({
  role: one(roles, { fields: [roleCategoryAccess.roleId], references: [roles.id] }),
}));
