import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { professionalProfiles, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/admin/profile
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Obtener perfil (reutilizamos la tabla professionalProfiles para bios de admins)
    let profile = await db.query.professionalProfiles.findFirst({
        where: eq(professionalProfiles.userId, userId)
    });

    // Si no existe, lo creamos vacío
    if (!profile) {
        const [newProfile] = await db.insert(professionalProfiles).values({
            userId,
            title: session.user.role === "SUPER_ADMIN" ? "Super Administrador" : "Administrador",
        }).returning();
        profile = newProfile;
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/admin/profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { bio, linkedinUrl, location } = body;

    // 1. Actualizar o insertar en professionalProfiles
    const existing = await db.query.professionalProfiles.findFirst({
        where: eq(professionalProfiles.userId, userId)
    });

    if (existing) {
        await db.update(professionalProfiles)
            .set({ 
                bio: bio ?? existing.bio, 
                linkedinUrl: linkedinUrl ?? existing.linkedinUrl,
                updatedAt: new Date()
            })
            .where(eq(professionalProfiles.userId, userId));
    } else {
        await db.insert(professionalProfiles).values({
            userId,
            bio,
            linkedinUrl,
            title: session.user.role === "SUPER_ADMIN" ? "Super Administrador" : "Administrador",
        });
    }

    // 2. Actualizar ubicación en la tabla User (si se proporcionó)
    if (location !== undefined) {
        await db.update(users)
            .set({ location })
            .where(eq(users.id, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
