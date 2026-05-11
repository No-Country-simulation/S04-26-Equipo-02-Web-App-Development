import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publications, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/publications - List all publications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // We join with users to get the author's name
    let query = db.select({
      id: publications.id,
      title: publications.title,
      content: publications.content,
      type: publications.type,
      image: publications.image,
      tags: publications.tags,
      status: publications.status,
      publishedAt: publications.publishedAt,
      createdAt: publications.createdAt,
      author: {
        id: users.id,
        name: users.name,
        image: users.image,
      }
    }).from(publications)
      .leftJoin(users, eq(publications.authorUserId, users.id))
      .$dynamic();

    if (status) {
      query = query.where(eq(publications.status, status));
    }

    const allPublications = await query.orderBy(desc(publications.createdAt));

    return NextResponse.json(allPublications);
  } catch (error) {
    console.error("❌ Error fetching publications:", error);
    return NextResponse.json({ message: "Error al obtener publicaciones" }, { status: 500 });
  }
}

// POST /api/publications - Create a new publication (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, type, image, tags, status } = body;

    if (!title || !content || !type) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const newPublication = await db.insert(publications).values({
      title,
      content,
      type,
      image,
      tags: tags ? JSON.stringify(tags) : null,
      status: status || "draft",
      authorUserId: session.user.id,
      publishedAt: status === "published" ? new Date() : null,
    }).returning();

    return NextResponse.json(newPublication[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating publication:", error);
    return NextResponse.json({ message: "Error al crear publicación" }, { status: 500 });
  }
}
