import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobPosts, companyProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/jobs - List all jobs or filter by company
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const companyOnly = searchParams.get("companyOnly") === "true";

    let userIdFilter = undefined;

    if (companyOnly) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session || session.user.role !== "COMPANY") {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
      }
      userIdFilter = session.user.id;
    }

    // Query jobs
    const allJobs = await db.query.jobPosts.findMany({
      where: (jobPosts, { eq, and }) => {
        const filters = [eq(jobPosts.status, status)];
        if (userIdFilter) {
          filters.push(eq(jobPosts.userId, userIdFilter));
        }
        return and(...filters);
      },
      orderBy: [desc(jobPosts.createdAt)],
    });

    return NextResponse.json(allJobs);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    return NextResponse.json({ message: "Error al obtener vacantes" }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job post (Company only)
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication and company role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "No autorizado. Solo empresas pueden crear vacantes." }, { status: 401 });
    }

    // 2. Parse body
    const body = await request.json();
    const { 
      title, 
      description, 
      requirements, 
      skillsRequired, // JSON string or array
      modality, 
      location, 
      salaryRange, 
      experienceRequired, 
      applicationDeadline 
    } = body;

    // 3. Validation
    if (!title || !description) {
      return NextResponse.json({ message: "Faltan campos obligatorios: título y descripción" }, { status: 400 });
    }

    // Get company profile id
    const companyProfile = await db.query.companyProfiles.findFirst({
      where: eq(companyProfiles.userId, session.user.id),
    });

    let companyProfileId = undefined;
    if (companyProfile) {
      companyProfileId = companyProfile.id;
    }

    // 4. Insert into database
    const newJob = await db.insert(jobPosts).values({
      userId: session.user.id,
      companyProfileId,
      title,
      description,
      requirements,
      skillsRequired: typeof skillsRequired === "string" ? skillsRequired : JSON.stringify(skillsRequired || []),
      modality,
      location,
      salaryRange,
      experienceRequired,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
    }).returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating job post:", error);
    return NextResponse.json({ message: "Error al crear vacante" }, { status: 500 });
  }
}
