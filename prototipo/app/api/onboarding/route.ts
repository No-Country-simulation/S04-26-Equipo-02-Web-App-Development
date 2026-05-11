import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, professionalProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await req.json();

    // Update or create professional profile
    const existingProfile = await db.query.professionalProfiles.findFirst({
        where: eq(professionalProfiles.userId, session.user.id)
    });

    const diagnosticData = {
        area: data.area,
        industry: data.industry,
        isWorking: data.isWorking,
        skills: data.selectedSkills,
        completedAt: new Date().toISOString()
    };

    if (existingProfile) {
      await db.update(professionalProfiles)
        .set({
          diagnosticResults: JSON.stringify(diagnosticData),
          progress: 10, // Initial progress for completing diagnostic
          updatedAt: new Date()
        })
        .where(eq(professionalProfiles.userId, session.user.id));
    } else {
      await db.insert(professionalProfiles).values({
        userId: session.user.id,
        diagnosticResults: JSON.stringify(diagnosticData),
        progress: 10,
      });
    }

    // Mark onboarding as completed in users table
    await db.update(users)
      .set({ onboardingCompleted: true })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in onboarding API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
