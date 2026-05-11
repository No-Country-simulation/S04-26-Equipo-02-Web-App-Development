import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, ilike, or, eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/admin/users - List all users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [];
    
    if (search) {
      conditions.push(or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`)
      ));
    }

    if (role && role !== "ALL") {
      if (role === "ADMIN") {
          // Both ADMIN and SUPER_ADMIN
          conditions.push(or(eq(users.role, "ADMIN"), eq(users.role, "SUPER_ADMIN")));
      } else {
          conditions.push(eq(users.role, role as "PROFESSIONAL" | "COMPANY" | "ADMIN" | "SUPER_ADMIN"));
      }
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // 1. Get total count for pagination
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(where);
    const totalItems = Number(totalResult[0]?.count || 0);
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Query paginated users
    const items = await db.query.users.findMany({
      where,
      orderBy: [desc(users.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      }
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ message: "Error al obtener usuarios" }, { status: 500 });
  }
}
