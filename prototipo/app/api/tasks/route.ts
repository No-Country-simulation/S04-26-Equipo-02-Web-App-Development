import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  userTasks, 
  professionalProfiles, 
  userLearningProgress, 
  learningModules,
  eventRegistrations,
  events 
} from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, desc } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/tasks - Get user's current weekly tasks (auto-generated + manual)
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    // 1. Fetch existing tasks from DB for this week
    const existingTasks = await db.query.userTasks.findMany({
      where: and(
        eq(userTasks.userId, userId),
        gte(userTasks.createdAt, monday)
      ),
      orderBy: [desc(userTasks.createdAt)],
    });

    // If we already generated tasks this week, just return them
    if (existingTasks.length > 0) {
      return NextResponse.json({ tasks: existingTasks });
    }

    // 2. Auto-generate tasks for the week based on user state
    const generatedTasks = await generateWeeklyTasks(userId);

    // 3. Insert generated tasks into DB
    const insertedTasks = [];
    for (const task of generatedTasks) {
      const result = await db
        .insert(userTasks)
        .values({
          userId,
          title: task.title,
          category: task.category,
          isCompleted: false,
        })
        .returning();
      insertedTasks.push(result[0]);
    }

    return NextResponse.json({ tasks: insertedTasks });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return NextResponse.json({ message: "Error al obtener tareas" }, { status: 500 });
  }
}

// PATCH /api/tasks - Mark task as completed
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, completed } = body as { taskId: string; completed: boolean };

    if (!taskId) {
      return NextResponse.json({ message: "taskId es requerido" }, { status: 400 });
    }

    // Verify ownership
    const task = await db.query.userTasks.findFirst({
      where: and(
        eq(userTasks.id, taskId),
        eq(userTasks.userId, session.user.id)
      ),
    });

    if (!task) {
      return NextResponse.json({ message: "Tarea no encontrada" }, { status: 404 });
    }

    const updated = await db
      .update(userTasks)
      .set({
        isCompleted: completed,
        completedAt: completed ? new Date() : null,
      })
      .where(eq(userTasks.id, taskId))
      .returning();

    return NextResponse.json({ success: true, task: updated[0] });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return NextResponse.json({ message: "Error al actualizar tarea" }, { status: 500 });
  }
}

// Helper: Generate weekly tasks based on user profile state
async function generateWeeklyTasks(userId: string) {
  const tasks: { title: string; category: string }[] = [];

  // 1. Check profile completeness
  const profile = await db.query.professionalProfiles.findFirst({
    where: eq(professionalProfiles.userId, userId),
  });

  if (!profile || (profile.progress ?? 0) < 50) {
    tasks.push({
      title: "Completar tu perfil profesional",
      category: "PERFIL",
    });
  }

  // 2. Check learning progress — suggest next module
  const allModules = await db.query.learningModules.findMany({
    where: eq(learningModules.isActive, true),
    orderBy: (modules, { asc }) => [asc(modules.category), asc(modules.orderInPath)],
  });

  const completedProgress = await db.query.userLearningProgress.findMany({
    where: and(
      eq(userLearningProgress.userId, userId),
      eq(userLearningProgress.status, "COMPLETED")
    ),
  });

  const completedIds = new Set(completedProgress.map((p) => p.moduleId));
  const inProgressRecords = await db.query.userLearningProgress.findMany({
    where: and(
      eq(userLearningProgress.userId, userId),
      eq(userLearningProgress.status, "IN_PROGRESS")
    ),
  });
  const inProgressIds = new Set(inProgressRecords.map((p) => p.moduleId));

  // Find an in-progress module to continue
  const continueModule = allModules.find((m) => inProgressIds.has(m.id));
  if (continueModule) {
    tasks.push({
      title: `Continuar: ${continueModule.title}`,
      category: continueModule.category,
    });
  }

  // Find the next module the user hasn't started
  const nextModule = allModules.find((m) => !completedIds.has(m.id) && !inProgressIds.has(m.id));
  if (nextModule) {
    tasks.push({
      title: `Iniciar módulo: ${nextModule.title}`,
      category: nextModule.category,
    });
  }

  // 3. Check upcoming events — suggest registration
  const now = new Date();
  const upcomingEvents = await db.query.events.findMany({
    where: and(
      eq(events.status, "active"),
      gte(events.date, now)
    ),
    orderBy: (events, { asc }) => [asc(events.date)],
  });

  // Check which events the user is already registered for
  const registrations = await db.query.eventRegistrations.findMany({
    where: eq(eventRegistrations.userId, userId),
  });
  const registeredEventIds = new Set(registrations.map((r) => r.eventId));

  const unregisteredEvent = upcomingEvents.find((e) => !registeredEventIds.has(e.id));
  if (unregisteredEvent) {
    tasks.push({
      title: `Inscribirse: ${unregisteredEvent.title}`,
      category: unregisteredEvent.type,
    });
  }

  // 4. Networking task (always encourage)
  if (completedProgress.length >= 2) {
    tasks.push({
      title: "Conectar con un profesional de la red",
      category: "NETWORKING",
    });
  }

  // Ensure at least 3 tasks
  if (tasks.length < 3) {
    const fillers = [
      { title: "Revisar tu ruta de aprendizaje", category: "DIGITAL" },
      { title: "Explorar las próximas actividades", category: "NETWORKING" },
      { title: "Actualizar tu perfil profesional", category: "PERFIL" },
    ];
    for (const filler of fillers) {
      if (tasks.length >= 4) break;
      if (!tasks.find((t) => t.title === filler.title)) {
        tasks.push(filler);
      }
    }
  }

  return tasks.slice(0, 5); // Max 5 weekly tasks
}
