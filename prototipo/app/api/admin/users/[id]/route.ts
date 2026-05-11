import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// PATCH /api/admin/users/[id] - Update user role
export async function PATCH(
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

    // 2. Parse body
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json({ message: "Rol no proporcionado" }, { status: 400 });
    }

    // Protect super admins from being downgraded by normal admins
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!targetUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "No puedes modificar a un SUPER_ADMIN" }, { status: 403 });
    }

    // 3. Update user role
    const updatedUser = await db
      .update(users)
      .set({ 
        role,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({ success: true, user: updatedUser[0] });
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    return NextResponse.json({ message: "Error al actualizar rol del usuario" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!targetUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "No puedes eliminar a un SUPER_ADMIN" }, { status: 403 });
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ message: "Error al eliminar usuario" }, { status: 500 });
  }
}
