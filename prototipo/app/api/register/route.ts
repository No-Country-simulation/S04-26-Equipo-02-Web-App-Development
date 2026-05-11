import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { professionalProfiles, companyProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, companyName, email, password, phone, location, role } = body;

    // 1. Validar campos básicos
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 2. Determinar el Nombre para Better Auth
    // Si es empresa, el nombre del usuario será el de la empresa.
    // Si es profesional, será Nombre + Apellido.
    const displayName = role === "COMPANY" 
        ? companyName 
        : `${firstName} ${lastName}`.trim();

    // 2. Crear usuario con Better Auth
    const signUpResult = await auth.api.signUpEmail({
      body: { 
        name: displayName, 
        email, 
        password,
        firstName,
        lastName: role === "COMPANY" ? "" : lastName, // Limpiamos lastName si es empresa
        phone,
        location,
        role 
      },
    });

    if (!signUpResult || !signUpResult.user) {
      return NextResponse.json(
        { message: "Error al crear el usuario" },
        { status: 500 }
      );
    }

    const userId = signUpResult.user.id;

    // 3. Crear el perfil correspondiente según el rol
    if (role === "PROFESSIONAL") {
      await db.insert(professionalProfiles).values({ 
        userId,
        title: "Nuevo Profesional",
      });
    } else if (role === "COMPANY") {
      await db.insert(companyProfiles).values({ 
        userId,
        companyName: companyName || "Nueva Empresa",
      });
    }

    // 4. Enviar email de bienvenida
    await sendWelcomeEmail(email, displayName, role);

    return NextResponse.json({ 
      success: true, 
      message: "Usuario registrado con éxito",
      user: signUpResult.user 
    }, { status: 201 });

  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("❌ Error en registro:", err);
    
    if (err.message?.includes("already exists")) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
