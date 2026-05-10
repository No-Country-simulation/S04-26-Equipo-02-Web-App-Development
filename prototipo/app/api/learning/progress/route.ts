import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userLearningProgress, learningModules, professionalProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/learning/progress - Get the user's learning progress with module details
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's progress records
    const progressRecords = await db.query.userLearningProgress.findMany({
      where: eq(userLearningProgress.userId, userId),
    });

    // Get all active modules
    const allModules = await db.query.learningModules.findMany({
      where: eq(learningModules.isActive, true),
      orderBy: (modules, { asc }) => [asc(modules.category), asc(modules.orderInPath)],
    });

    // Merge progress with modules
    const modulesWithProgress = allModules.map((mod) => {
      const progress = progressRecords.find((p) => p.moduleId === mod.id);
      return {
        ...mod,
        progress: progress
          ? {
              status: progress.status,
              score: progress.score,
              startedAt: progress.startedAt,
              completedAt: progress.completedAt,
            }
          : {
              status: "NOT_STARTED" as const,
              score: null,
              startedAt: null,
              completedAt: null,
            },
      };
    });

    // Calculate stats
    const totalModules = allModules.length;
    const completedModules = progressRecords.filter((p) => p.status === "COMPLETED").length;
    const inProgressModules = progressRecords.filter((p) => p.status === "IN_PROGRESS").length;
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    // Group by category
    const grouped = {
      DIGITAL: modulesWithProgress.filter((m) => m.category === "DIGITAL"),
      SOCIOEMOCIONAL: modulesWithProgress.filter((m) => m.category === "SOCIOEMOCIONAL"),
      COGNITIVO: modulesWithProgress.filter((m) => m.category === "COGNITIVO"),
    };

    // Category stats
    const categoryStats = {
      DIGITAL: {
        total: grouped.DIGITAL.length,
        completed: grouped.DIGITAL.filter((m) => m.progress.status === "COMPLETED").length,
        percentage: grouped.DIGITAL.length > 0 
          ? Math.round((grouped.DIGITAL.filter((m) => m.progress.status === "COMPLETED").length / grouped.DIGITAL.length) * 100) 
          : 0,
      },
      SOCIOEMOCIONAL: {
        total: grouped.SOCIOEMOCIONAL.length,
        completed: grouped.SOCIOEMOCIONAL.filter((m) => m.progress.status === "COMPLETED").length,
        percentage: grouped.SOCIOEMOCIONAL.length > 0 
          ? Math.round((grouped.SOCIOEMOCIONAL.filter((m) => m.progress.status === "COMPLETED").length / grouped.SOCIOEMOCIONAL.length) * 100) 
          : 0,
      },
      COGNITIVO: {
        total: grouped.COGNITIVO.length,
        completed: grouped.COGNITIVO.filter((m) => m.progress.status === "COMPLETED").length,
        percentage: grouped.COGNITIVO.length > 0 
          ? Math.round((grouped.COGNITIVO.filter((m) => m.progress.status === "COMPLETED").length / grouped.COGNITIVO.length) * 100) 
          : 0,
      },
    };

    return NextResponse.json({
      modules: modulesWithProgress,
      grouped,
      stats: {
        totalModules,
        completedModules,
        inProgressModules,
        overallProgress,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching learning progress:", error);
    return NextResponse.json({ message: "Error al obtener progreso" }, { status: 500 });
  }
}

// POST /api/learning/progress - Update progress for a module (start / complete)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { moduleId, action, score } = body as {
      moduleId: string;
      action: "start" | "complete";
      score?: number;
    };

    if (!moduleId || !action) {
      return NextResponse.json({ message: "moduleId y action son requeridos" }, { status: 400 });
    }

    // Check module exists
    const mod = await db.query.learningModules.findFirst({
      where: eq(learningModules.id, moduleId),
    });

    if (!mod) {
      return NextResponse.json({ message: "Módulo no encontrado" }, { status: 404 });
    }

    // Check existing progress
    const existing = await db.query.userLearningProgress.findFirst({
      where: and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.moduleId, moduleId)
      ),
    });

    if (action === "start") {
      if (existing) {
        // If already started or completed, just return current state
        return NextResponse.json({ message: "Ya iniciaste este módulo", progress: existing });
      }

      const newProgress = await db
        .insert(userLearningProgress)
        .values({
          userId,
          moduleId,
          status: "IN_PROGRESS",
          startedAt: new Date(),
        })
        .returning();

      return NextResponse.json({ success: true, progress: newProgress[0] }, { status: 201 });
    }

    if (action === "complete") {
      if (existing?.status === "COMPLETED") {
        return NextResponse.json({ message: "Módulo ya completado", progress: existing });
      }

      if (existing) {
        // Update existing record
        const updated = await db
          .update(userLearningProgress)
          .set({
            status: "COMPLETED",
            completedAt: new Date(),
            ...(score !== undefined && { score }),
          })
          .where(eq(userLearningProgress.id, existing.id))
          .returning();

        // Update overall professional profile progress
        await updateProfileProgress(userId);

        return NextResponse.json({ success: true, progress: updated[0] });
      } else {
        // Create completed record directly
        const newProgress = await db
          .insert(userLearningProgress)
          .values({
            userId,
            moduleId,
            status: "COMPLETED",
            startedAt: new Date(),
            completedAt: new Date(),
            ...(score !== undefined && { score }),
          })
          .returning();

        await updateProfileProgress(userId);

        return NextResponse.json({ success: true, progress: newProgress[0] }, { status: 201 });
      }
    }

    return NextResponse.json({ message: "Acción inválida. Usa 'start' o 'complete'" }, { status: 400 });
  } catch (error) {
    console.error("❌ Error updating learning progress:", error);
    return NextResponse.json({ message: "Error al actualizar progreso" }, { status: 500 });
  }
}

// Helper: Update the professional profile overall progress based on modules completed
async function updateProfileProgress(userId: string) {
  try {
    const allModules = await db.query.learningModules.findMany({
      where: eq(learningModules.isActive, true),
    });

    const completedProgress = await db.query.userLearningProgress.findMany({
      where: and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.status, "COMPLETED")
      ),
    });

    // Base 10% for completing onboarding + up to 90% for modules
    const moduleProgress = allModules.length > 0
      ? Math.round((completedProgress.length / allModules.length) * 90)
      : 0;
    const totalProgress = 10 + moduleProgress; // 10 base from onboarding

    await db
      .update(professionalProfiles)
      .set({ progress: Math.min(totalProgress, 100), updatedAt: new Date() })
      .where(eq(professionalProfiles.userId, userId));
  } catch (err) {
    console.error("Error updating profile progress:", err);
  }
}
