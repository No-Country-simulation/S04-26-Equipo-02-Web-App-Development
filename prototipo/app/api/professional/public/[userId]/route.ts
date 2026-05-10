import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, professionalProfiles, professionalSkills, userLearningProgress, learningModules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/professional/public/[userId] - Get public profile for any user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get user basic info
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.role !== "PROFESSIONAL") {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Get professional profile
    const profile = await db.query.professionalProfiles.findFirst({
      where: eq(professionalProfiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Get skills
    const skills = await db.query.professionalSkills.findMany({
      where: eq(professionalSkills.userId, userId),
    });

    // Get learning progress
    const allModules = await db.query.learningModules.findMany({
      where: eq(learningModules.isActive, true),
    });
    const completedModules = await db.query.userLearningProgress.findMany({
      where: and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.status, "COMPLETED")
      ),
    });

    // Safe JSON parse helper
    function safeParseJSON(value: string | null): unknown[] {
      if (!value) return [];
      try { return JSON.parse(value); } catch { return []; }
    }

    // Employability score
    let employabilityScore = 0;
    if (profile.headline) employabilityScore += 5;
    if (profile.summary) employabilityScore += 5;
    if (profile.linkedinUrl) employabilityScore += 3;
    const workExp = safeParseJSON(profile.workExperience);
    employabilityScore += Math.min(workExp.length * 3, 9);
    const edu = safeParseJSON(profile.education);
    employabilityScore += Math.min(edu.length * 2, 6);
    employabilityScore += Math.min(skills.length * 2, 10);
    employabilityScore += Math.min(skills.filter(s => s.isValidated).length * 3, 10);
    if (allModules.length > 0) {
      employabilityScore += Math.round((completedModules.length / allModules.length) * 30);
    }
    const certs = safeParseJSON(profile.certifications);
    employabilityScore += Math.min(certs.length * 3, 6);
    const langs = safeParseJSON(profile.languages);
    employabilityScore += Math.min(langs.length * 2, 4);
    if (profile.availabilityStatus === "disponible") employabilityScore += 10;
    else if (profile.availabilityStatus === "en_proceso") employabilityScore += 5;
    employabilityScore = Math.min(employabilityScore, 100);

    // Return public-safe data (exclude sensitive info)
    return NextResponse.json({
      user: {
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        location: user.location,
        createdAt: user.createdAt,
      },
      profile: {
        headline: profile.headline,
        summary: profile.summary,
        title: profile.title,
        bio: profile.bio,
        experienceYears: profile.experienceYears,
        linkedinUrl: profile.linkedinUrl,
        portfolioUrl: profile.portfolioUrl,
        workExperience: safeParseJSON(profile.workExperience),
        education: safeParseJSON(profile.education),
        certifications: safeParseJSON(profile.certifications),
        languages: safeParseJSON(profile.languages),
        availabilityStatus: profile.availabilityStatus,
        modalityPreference: profile.modalityPreference,
        progress: profile.progress,
      },
      skills,
      employabilityScore,
      learningStats: {
        completed: completedModules.length,
        total: allModules.length,
      },
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
