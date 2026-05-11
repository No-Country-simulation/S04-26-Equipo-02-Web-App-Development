import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventRegistrations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/events/registrations - Get IDs of events the current user is registered for
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const registrations = await db.query.eventRegistrations.findMany({
      where: eq(eventRegistrations.userId, session.user.id),
      columns: {
        eventId: true,
      },
    });

    return NextResponse.json(registrations.map(r => r.eventId));
  } catch (error) {
    console.error("❌ Error fetching registrations:", error);
    return await Promise.resolve(NextResponse.json({ message: "Error al obtener inscripciones" }, { status: 500 }));
  }
}
