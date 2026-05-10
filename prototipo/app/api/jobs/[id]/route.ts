import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { jobPosts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/jobs/[id] - Get a single job post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await db.query.jobPosts.findFirst({
      where: eq(jobPosts.id, id),
    });

    if (!job) {
      return NextResponse.json({ message: "Vacante no encontrada" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("❌ Error fetching job:", error);
    return NextResponse.json({ message: "Error al obtener la vacante" }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - Update a job post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Verify ownership
    const existingJob = await db.query.jobPosts.findFirst({
      where: and(eq(jobPosts.id, id), eq(jobPosts.userId, session.user.id)),
    });

    if (!existingJob) {
      return NextResponse.json({ message: "Vacante no encontrada o no tienes permisos" }, { status: 404 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      requirements, 
      skillsRequired,
      modality, 
      location, 
      salaryRange, 
      experienceRequired, 
      applicationDeadline,
      status
    } = body;

    const updatedJob = await db.update(jobPosts).set({
      title,
      description,
      requirements,
      skillsRequired: skillsRequired ? (typeof skillsRequired === "string" ? skillsRequired : JSON.stringify(skillsRequired)) : undefined,
      modality,
      location,
      salaryRange,
      experienceRequired,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      status
    })
    .where(eq(jobPosts.id, id))
    .returning();

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error("❌ Error updating job:", error);
    return NextResponse.json({ message: "Error al actualizar la vacante" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Archive/Cancel a job post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "COMPANY") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Verify ownership
    const existingJob = await db.query.jobPosts.findFirst({
      where: and(eq(jobPosts.id, id), eq(jobPosts.userId, session.user.id)),
    });

    if (!existingJob) {
      return NextResponse.json({ message: "Vacante no encontrada o no tienes permisos" }, { status: 404 });
    }

    // Soft delete (change status)
    const archivedJob = await db.update(jobPosts).set({
      status: "archived"
    })
    .where(eq(jobPosts.id, id))
    .returning();

    return NextResponse.json(archivedJob[0]);
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    return NextResponse.json({ message: "Error al eliminar la vacante" }, { status: 500 });
  }
}
