import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await db.query.events.findFirst({
      where: eq(events.id, id),
    });

    if (!event) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("❌ Error fetching event:", error);
    return NextResponse.json({ message: "Error al obtener evento" }, { status: 500 });
  }
}

// PUT /api/events/[id] - Update event (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check authentication and admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // 2. Check event exists
    const existing = await db.query.events.findFirst({
      where: eq(events.id, id),
    });

    if (!existing) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }

    // 3. Parse body and update
    const body = await request.json();
    const {
      title,
      description,
      type,
      date,
      startTime,
      endTime,
      speaker,
      zoomLink,
      registrationLink,
      image,
      isFree,
      maxAttendees,
      status,
    } = body;

    const updated = await db
      .update(events)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(speaker !== undefined && { speaker }),
        ...(zoomLink !== undefined && { zoomLink }),
        ...(registrationLink !== undefined && { registrationLink }),
        ...(image !== undefined && { image }),
        ...(isFree !== undefined && { isFree }),
        ...(maxAttendees !== undefined && { maxAttendees }),
        ...(status !== undefined && { status }),
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("❌ Error updating event:", error);
    return NextResponse.json({ message: "Error al actualizar evento" }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete/archive event (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check authentication and admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // 2. Soft delete — archive the event instead of removing from DB
    const archived = await db
      .update(events)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    if (archived.length === 0) {
      return NextResponse.json({ message: "Evento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Evento archivado" });
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    return NextResponse.json({ message: "Error al eliminar evento" }, { status: 500 });
  }
}
