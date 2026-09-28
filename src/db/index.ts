import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;
let pool: Pool | undefined;

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Connect a Postgres database and add its connection string to .env.local.");
  pool ??= new Pool({ connectionString: url, max: 2 });
  database ??= drizzle(pool, { schema });
  return database;
}

