import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  console.log("🚀 Starting database migration...");
  const db = drizzle(migrationClient);
  
  await migrate(db, { migrationsFolder: "./drizzle" });
  
  console.log("✅ Migration completed successfully!");
  await migrationClient.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed:");
  console.error(err);
  process.exit(1);
});
