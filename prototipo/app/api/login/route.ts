import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Usamos Better Auth para validar las credenciales
    const result = await auth.api.signInEmail({
      body: { email, password },
    });

    if (!result || !result.user) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "LOGIN_SUCCESS",
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      }
    });

  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("❌ Error en login:", err);
    return NextResponse.json(
      { message: err.message || "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
