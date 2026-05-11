import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventRegistrations, events } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

// POST /api/events/[id]/register - Register current user to an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Check if event exists
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }

    // 3. Check if already registered
    const existingRegistration = await db.query.eventRegistrations.findFirst({
      where: and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.userId, userId)
      ),
    });

    if (existingRegistration) {
      return NextResponse.json({ message: "Ya estás registrado en este evento" }, { status: 400 });
    }

    // 4. Register user
    const registration = await db.insert(eventRegistrations).values({
      eventId,
      userId,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      message: "Registro exitoso",
      registration: registration[0]
    });

  } catch (error) {
    console.error("❌ Error registering for event:", error);
    return NextResponse.json({ message: "Error al registrarse al evento" }, { status: 500 });
  }
}
