import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendPasswordChangeConfirmationEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    
    // 1. Verificamos la sesión por seguridad
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.email !== email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Desactivamos el flag de cambio obligatorio
    await db.update(users)
      .set({ mustChangePassword: false })
      .where(eq(users.email, email));

    // 3. Enviamos el correo de confirmación
    await sendPasswordChangeConfirmationEmail(email, name);

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Error confirmando cambio de clave:", error);
    return NextResponse.json({ error: "Error al procesar la confirmación" }, { status: 500 });
  }
}
