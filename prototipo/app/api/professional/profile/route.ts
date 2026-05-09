import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { professionalProfiles } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { headers } from "next/headers";
import { userTasks } from "@/lib/db/schema";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get basic profile
    const profile = await db.query.professionalProfiles.findFirst({
        where: eq(professionalProfiles.userId, userId)
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Get counts from userTasks
    const taskCounts = await db
      .select({ 
        category: userTasks.category, 
        count: count() 
      })
      .from(userTasks)
      .where(
        and(
          eq(userTasks.userId, userId),
          eq(userTasks.isCompleted, true)
        )
      )
      .groupBy(userTasks.category);

    // Format counts into a more usable object
    const stats = {
      webinars: taskCounts.find(t => t.category === "WEBINAR")?.count || 0,
      workshops: taskCounts.find(t => t.category === "WORKSHOP")?.count || 0,
      networking: taskCounts.find(t => t.category === "NETWORKING")?.count || 0,
    };

    return NextResponse.json({
      ...profile,
      stats
    });
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
