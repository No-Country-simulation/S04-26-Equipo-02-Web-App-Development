import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobApplications, jobPosts, users, professionalProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, inArray } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/applications - List applications
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobPostId = searchParams.get("jobPostId");

    if (session.user.role === "PROFESSIONAL") {
      // Professionals see their own applications
      const myApplications = await db.query.jobApplications.findMany({
        where: eq(jobApplications.professionalUserId, session.user.id),
      });
      return NextResponse.json(myApplications);

    } else if (session.user.role === "COMPANY") {
      // Companies see applications to their jobs
      // 1. Get all jobs of the company
      const companyJobs = await db.query.jobPosts.findMany({
        where: eq(jobPosts.userId, session.user.id),
        columns: { id: true },
      });

      const companyJobIds = companyJobs.map(job => job.id);

      if (companyJobIds.length === 0) {
        return NextResponse.json([]);
      }

      // 2. Filter by specific job if provided
      let whereClause;
      if (jobPostId && companyJobIds.includes(jobPostId)) {
        whereClause = eq(jobApplications.jobPostId, jobPostId);
      } else {
        whereClause = inArray(jobApplications.jobPostId, companyJobIds);
      }

      const applicationsQuery = await db.query.jobApplications.findMany({
        where: whereClause,
      });

      // Join with users and professional profiles manually since we might not have relations defined
      const enrichedApplications = await Promise.all(applicationsQuery.map(async (app) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, app.professionalUserId)
        });
        const profile = await db.query.professionalProfiles.findFirst({
          where: eq(professionalProfiles.userId, app.professionalUserId)
        });

        return {
          ...app,
          user: user || null,
          profile: profile || null,
        };
      }));

      return NextResponse.json(enrichedApplications);
    }

    return NextResponse.json({ message: "Rol no válido para consultar postulaciones" }, { status: 403 });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return NextResponse.json({ message: "Error al obtener postulaciones" }, { status: 500 });
  }
}

// POST /api/applications - Apply to a job
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "PROFESSIONAL") {
      return NextResponse.json({ message: "No autorizado. Solo profesionales pueden postularse." }, { status: 401 });
    }

    const body = await request.json();
    const { jobPostId, coverLetter } = body;

    if (!jobPostId) {
      return NextResponse.json({ message: "Falta el ID de la vacante" }, { status: 400 });
    }

    // Verify if already applied
    const existingApplication = await db.query.jobApplications.findFirst({
      where: and(
        eq(jobApplications.jobPostId, jobPostId),
        eq(jobApplications.professionalUserId, session.user.id)
      )
    });

    if (existingApplication) {
      return NextResponse.json({ message: "Ya te has postulado a esta vacante" }, { status: 400 });
    }

    const newApplication = await db.insert(jobApplications).values({
      jobPostId,
      professionalUserId: session.user.id,
      coverLetter,
      status: "APPLIED",
    }).returning();

    return NextResponse.json(newApplication[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating application:", error);
    return NextResponse.json({ message: "Error al postularse" }, { status: 500 });
  }
}
