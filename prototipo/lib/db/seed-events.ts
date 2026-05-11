import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { events } from "./schema";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const seedEvents = [
  {
    title: "Gestión Emocional: la clave para una búsqueda laboral efectiva",
    description: "Enfocado en identificar emociones que paralizan la búsqueda laboral y cómo usarlas a favor. Facilitado por Vanina Colazo y Ana Caro Corbelle.",
    type: "WORKSHOP" as const,
    date: new Date("2026-11-27T18:30:00"),
    startTime: "18:30",
    endTime: "20:30",
    speaker: "Vanina Colazo & Ana Caro Corbelle",
    zoomLink: "https://zoom.us/j/example1",
    isFree: true,
    status: "active",
  },
  {
    title: "¿Sabés qué están buscando hoy las empresas? Y cómo mostrarlo en una entrevista",
    description: "Charla con Luciana Simonazzi (Referente de Talent Acquisition Cluster Sur en BASF) sobre las demandas actuales del mercado laboral.",
    type: "WEBINAR" as const,
    date: new Date("2026-05-20T18:30:00"),
    startTime: "18:30",
    endTime: "19:30",
    speaker: "Luciana Simonazzi (BASF)",
    zoomLink: "https://zoom.us/j/example2",
    isFree: true,
    status: "active",
  },
  {
    title: "Networking Senior: Conectando Experiencia",
    description: "Espacio de encuentro para profesionales +45 para intercambiar experiencias y generar red de contactos.",
    type: "NETWORKING" as const,
    date: new Date("2026-06-15T19:00:00"),
    startTime: "19:00",
    endTime: "21:00",
    speaker: "Equipo Red Bienestar",
    isFree: true,
    status: "active",
  }
];

async function main() {
  console.log("🌱 Seeding events...");
  
  for (const event of seedEvents) {
    await db.insert(events).values(event).onConflictDoNothing();
    console.log(`✅ Added event: ${event.title}`);
  }
  
  console.log("✨ Seeding completed!");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:");
  console.error(err);
  process.exit(1);
});
