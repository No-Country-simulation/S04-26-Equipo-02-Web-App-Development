import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/events - List all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status") || "active";

    // Query events
    // For now, basic fetch. We can add filtering later.
    const allEvents = await db.query.events.findMany({
      where: (events, { eq, and }) => {
        const filters = [eq(events.status, status as "active" | "archived" | "cancelled")];
        if (type) filters.push(eq(events.type, type as "WEBINAR" | "WORKSHOP" | "NETWORKING" | "CURSO" | "MEETING"));
        return and(...filters);
      },
      orderBy: [desc(events.date)],
    });

    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return NextResponse.json({ message: "Error al obtener eventos" }, { status: 500 });
  }
}

// POST /api/events - Create a new event (Admin only)
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication and admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // 2. Parse body
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
      maxAttendees 
    } = body;

    // 3. Validation
    if (!title || !description || !date || !type) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 4. Insert into database
    const newEvent = await db.insert(events).values({
      title,
      description,
      type,
      date: new Date(date),
      startTime,
      endTime,
      speaker,
      zoomLink,
      registrationLink,
      image,
      isFree: isFree !== undefined ? isFree : true,
      maxAttendees,
    }).returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    return NextResponse.json({ message: "Error al crear evento" }, { status: 500 });
  }
}
