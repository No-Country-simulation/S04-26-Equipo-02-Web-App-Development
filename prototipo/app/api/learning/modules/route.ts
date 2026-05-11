import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { learningModules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/learning/modules - List all active learning modules
export async function GET() {
  try {
    const modules = await db.query.learningModules.findMany({
      where: eq(learningModules.isActive, true),
      orderBy: (modules, { asc }) => [asc(modules.category), asc(modules.orderInPath)],
    });

    // Group by category for easier frontend consumption
    const grouped = {
      DIGITAL: modules.filter((m) => m.category === "DIGITAL"),
      SOCIOEMOCIONAL: modules.filter((m) => m.category === "SOCIOEMOCIONAL"),
      COGNITIVO: modules.filter((m) => m.category === "COGNITIVO"),
    };

    return NextResponse.json({ modules, grouped });
  } catch (error) {
    console.error("❌ Error fetching learning modules:", error);
    return NextResponse.json({ message: "Error al obtener módulos" }, { status: 500 });
  }
}
