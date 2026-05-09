import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const sql = postgres(process.env.DATABASE_URL);

  console.log("🛠️ Iniciando sincronización manual de la base de datos...");

  try {
    // 1. Añadir columna onboarding_completed a la tabla user si no existe
    console.log("Adding onboarding_completed to user table...");
    await sql.unsafe(`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false NOT NULL;
    `);

    // 2. Crear tabla user_task
    console.log("Creating user_task table...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS "user_task" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "userId" text NOT NULL,
        "title" text NOT NULL,
        "category" text NOT NULL,
        "is_completed" boolean DEFAULT false NOT NULL,
        "completed_at" timestamp,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "user_task_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action
      );
    `);

    // 3. Actualizar tabla event con nuevos campos
    console.log("Updating event table fields...");
    await sql.unsafe(`
      ALTER TABLE "event" 
      ADD COLUMN IF NOT EXISTS "start_time" text,
      ADD COLUMN IF NOT EXISTS "end_time" text;
    `);

    // 4. Actualizar ENUM event_type (Postgres no permite ADD VALUE IF NOT EXISTS dentro de una transacción en versiones viejas, pero probamos)
    console.log("Updating event_type enum...");
    try {
      await sql.unsafe(`ALTER TYPE "event_type" ADD VALUE 'MEETING';`);
    } catch {
    }
    try {
      await sql.unsafe(`ALTER TYPE "event_type" ADD VALUE 'CURSO';`);
    } catch {
    }

    console.log("✅ Sincronización completada con éxito.");
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
  } finally {
    await sql.end();
  }
}

main();
