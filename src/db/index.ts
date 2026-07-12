import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// Not used by the app yet — the UI runs on the mock data layer in
// `src/lib/mock-data` for this demo. Once a real Postgres instance (e.g.
// Neon) is provisioned, set DATABASE_URL and start importing `db` from here
// instead of the mock layer. postgres-js connects lazily, so this module is
// safe to import even when DATABASE_URL is unset.
const client = postgres(process.env.DATABASE_URL ?? "", { max: 1 });

export const db = drizzle(client, { schema });

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
