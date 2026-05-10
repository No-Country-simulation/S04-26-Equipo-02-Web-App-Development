import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companyProfiles, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/company/profile
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const companyProfile = await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, userId),
    });

    return NextResponse.json({
      user: userRecord,
      company: companyProfile,
    });
  } catch (error) {
    console.error("❌ Error fetching company profile:", error);
    return NextResponse.json({ message: "Error al obtener perfil" }, { status: 500 });
  }
}

// PUT /api/company/profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      firstName,
      lastName,
      companyName,
      industry,
      size,
      website,
      description,
      location,
      phone
    } = body;

    // Actualizar datos del usuario responsable
    await db.update(users)
      .set({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        location,
        phone,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Actualizar datos de la empresa
    const updatedCompany = await db.update(companyProfiles)
      .set({
        companyName,
        industry,
        size,
        website,
        description,
        updatedAt: new Date(),
      })
      .where(eq(companyProfiles.userId, userId))
      .returning();

    // Si no existía el perfil de empresa, lo creamos
    if (updatedCompany.length === 0) {
      await db.insert(companyProfiles).values({
        userId,
        companyName: companyName || lastName || "Nueva Empresa",
        industry,
        size,
        website,
        description,
      });
    }

    return NextResponse.json({ message: "Perfil actualizado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating company profile:", error);
    return NextResponse.json({ message: "Error al actualizar perfil" }, { status: 500 });
  }
}
