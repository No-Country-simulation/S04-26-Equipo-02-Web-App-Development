import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendPasswordChangeConfirmationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, tempPassword, newPassword, name } = await req.json();

    if (!email || !tempPassword || !newPassword) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 1. Buscar al usuario y verificar que deba cambiar la clave
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase())
    });

    if (!user || user.mustChangePassword === false) {
      return NextResponse.json({ error: "Estado de cuenta no válido para esta acción" }, { status: 400 });
    }

    // 2. Verificar la clave temporal actual
    const account = await db.query.accounts.findFirst({
        where: and(
            eq(accounts.userId, user.id),
            eq(accounts.providerId, "email")
        )
    });

    if (!account || !account.password) {
        return NextResponse.json({ error: "No se encontró el registro de cuenta" }, { status: 404 });
    }

    // IMPORTANTE: Verificar clave temporal usando el hasher oficial de Better Auth
    const serverAuth = auth as unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isTempValid = await (serverAuth as any).password.verify({
        password: account.password, // El hash actual
        input: tempPassword         // Lo que puso el usuario
    });

    if (!isTempValid) {
        return NextResponse.json({ error: "La contraseña temporal no es correcta" }, { status: 401 });
    }

    // 3. Todo OK: Cifrar nueva clave y actualizar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newHashedPassword = await (serverAuth as any).password.hash(newPassword);

    await db.update(accounts)
        .set({ password: newHashedPassword, updatedAt: new Date() })
        .where(eq(accounts.id, account.id));

    await db.update(users)
        .set({ mustChangePassword: false, updatedAt: new Date() })
        .where(eq(users.id, user.id));

    // 4. Confirmación por email
    await sendPasswordChangeConfirmationEmail(email, name || user.name || "Colaborador");

    return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" });

  } catch (error: unknown) {
    console.error("Error en setup-editor-password:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
