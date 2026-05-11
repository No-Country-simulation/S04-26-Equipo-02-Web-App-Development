import postgres from "postgres";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const sql = postgres(process.env.DATABASE_URL);

async function main() {
  console.log("🚀 Applying migration 0001 manually...");
  
  const migrationPath = path.join(process.cwd(), "drizzle", "0001_icy_nuke.sql");
  const content = fs.readFileSync(migrationPath, "utf-8");
  
  // Split by statement-breakpoint
  const statements = content.split("--> statement-breakpoint");
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;
    
    console.log(`Executing: ${trimmed.substring(0, 50)}...`);
    try {
      await sql.unsafe(trimmed);
      console.log("✅ Success");
    } catch (err: unknown) {
      const error = err as { message: string };
      if (error.message.includes("already exists")) {
        console.log("⚠️ Already exists, skipping...");
      } else {
        console.error("❌ Failed:");
        console.error(err);
      }
    }
  }
  
  console.log("✨ Manual migration finished!");
  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Fatal error:");
  console.error(err);
  process.exit(1);
});
