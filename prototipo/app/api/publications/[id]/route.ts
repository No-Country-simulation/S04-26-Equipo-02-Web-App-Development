import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// PUT /api/publications/[id] - Update publication (Admin only)
export async function PUT(
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

    const body = await request.json();
    const { title, content, type, image, tags, status } = body;

    const existing = await db.query.publications.findFirst({
      where: eq(publications.id, id),
    });

    if (!existing) {
      return NextResponse.json({ message: "Publicación no encontrada" }, { status: 404 });
    }

    const updated = await db.update(publications).set({
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(type !== undefined && { type }),
      ...(image !== undefined && { image }),
      ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      ...(status !== undefined && { status }),
      ...(status === "published" && existing.status !== "published" && { publishedAt: new Date() }),
      updatedAt: new Date(),
    }).where(eq(publications.id, id)).returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("❌ Error updating publication:", error);
    return NextResponse.json({ message: "Error al actualizar publicación" }, { status: 500 });
  }
}

// DELETE /api/publications/[id] - Delete publication (Admin only)
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

    await db.delete(publications).where(eq(publications.id, id));

    return NextResponse.json({ success: true, message: "Publicación eliminada" });
  } catch (error) {
    console.error("❌ Error deleting publication:", error);
    return NextResponse.json({ message: "Error al eliminar publicación" }, { status: 500 });
  }
}
