import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { professionalProfiles, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, or, ilike } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/talent/search - Search professional profiles
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "No autorizado. Solo empresas pueden buscar talento." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    
    // For now we'll do a basic fetch. In a real scenario we'd use filters 
    // for skills, location, modality, etc.

    let profiles;

    if (query) {
      // Basic text search on title or headline
      profiles = await db
        .select({
          id: professionalProfiles.id,
          userId: professionalProfiles.userId,
          title: professionalProfiles.title,
          headline: professionalProfiles.headline,
          summary: professionalProfiles.summary,
          skills: professionalProfiles.skills,
          availabilityStatus: professionalProfiles.availabilityStatus,
          score: professionalProfiles.progress, // Assuming progress acts as a score for now
          user: {
            name: users.name,
            firstName: users.firstName,
            lastName: users.lastName,
            image: users.image,
            location: users.location,
          }
        })
        .from(professionalProfiles)
        .innerJoin(users, eq(professionalProfiles.userId, users.id))
        .where(
          or(
            ilike(professionalProfiles.title, `%${query}%`),
            ilike(professionalProfiles.headline, `%${query}%`)
          )
        )
        .limit(20);
    } else {
      profiles = await db
        .select({
          id: professionalProfiles.id,
          userId: professionalProfiles.userId,
          title: professionalProfiles.title,
          headline: professionalProfiles.headline,
          summary: professionalProfiles.summary,
          skills: professionalProfiles.skills,
          availabilityStatus: professionalProfiles.availabilityStatus,
          score: professionalProfiles.progress,
          user: {
            name: users.name,
            firstName: users.firstName,
            lastName: users.lastName,
            image: users.image,
            location: users.location,
          }
        })
        .from(professionalProfiles)
        .innerJoin(users, eq(professionalProfiles.userId, users.id))
        .limit(20);
    }

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("❌ Error searching talent:", error);
    return NextResponse.json({ message: "Error al buscar talento" }, { status: 500 });
  }
}
