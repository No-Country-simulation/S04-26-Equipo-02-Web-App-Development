import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { professionalProfiles, professionalSkills, userLearningProgress, learningModules } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { headers } from "next/headers";
import { userTasks } from "@/lib/db/schema";

// GET /api/professional/profile - Get current user's profile with stats
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get basic profile
    const profile = await db.query.professionalProfiles.findFirst({
        where: eq(professionalProfiles.userId, userId)
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Get counts from userTasks
    const taskCounts = await db
      .select({ 
        category: userTasks.category, 
        count: count() 
      })
      .from(userTasks)
      .where(
        and(
          eq(userTasks.userId, userId),
          eq(userTasks.isCompleted, true)
        )
      )
      .groupBy(userTasks.category);

    // Format counts into a more usable object
    const stats = {
      webinars: taskCounts.find(t => t.category === "WEBINAR")?.count || 0,
      workshops: taskCounts.find(t => t.category === "WORKSHOP")?.count || 0,
      networking: taskCounts.find(t => t.category === "NETWORKING")?.count || 0,
    };

    // Get validated skills
    const skills = await db.query.professionalSkills.findMany({
      where: eq(professionalSkills.userId, userId),
    });

    // Get learning progress for employability score
    const allModules = await db.query.learningModules.findMany({
      where: eq(learningModules.isActive, true),
    });
    const completedModules = await db.query.userLearningProgress.findMany({
      where: and(
        eq(userLearningProgress.userId, userId),
        eq(userLearningProgress.status, "COMPLETED")
      ),
    });

    // Calculate employability score (0-100)
    const employabilityScore = calculateEmployabilityScore(profile, skills, completedModules.length, allModules.length);

    return NextResponse.json({
      ...profile,
      // Parse JSON fields for the frontend
      certifications: safeParseJSON(profile.certifications),
      languages: safeParseJSON(profile.languages),
      workExperience: safeParseJSON(profile.workExperience),
      education: safeParseJSON(profile.education),
      stats,
      skills,
      employabilityScore,
      learningStats: {
        completed: completedModules.length,
        total: allModules.length,
      },
    });
  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/professional/profile - Update profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      headline,
      summary,
      title,
      bio,
      experienceYears,
      linkedinUrl,
      portfolioUrl,
      certifications,
      languages,
      workExperience,
      education,
      availabilityStatus,
      salaryExpectation,
      modalityPreference,
    } = body;

    // Check if profile exists
    const existing = await db.query.professionalProfiles.findFirst({
      where: eq(professionalProfiles.userId, userId),
    });

    if (!existing) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Calculate profile completeness for progress
    const completeness = calculateProfileCompleteness({
      headline, summary, title, bio, experienceYears,
      linkedinUrl, portfolioUrl, certifications, languages,
      workExperience, education,
    });

    // Update profile
    const updated = await db
      .update(professionalProfiles)
      .set({
        ...(headline !== undefined && { headline }),
        ...(summary !== undefined && { summary }),
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(experienceYears !== undefined && { experienceYears }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(certifications !== undefined && { certifications: JSON.stringify(certifications) }),
        ...(languages !== undefined && { languages: JSON.stringify(languages) }),
        ...(workExperience !== undefined && { workExperience: JSON.stringify(workExperience) }),
        ...(education !== undefined && { education: JSON.stringify(education) }),
        ...(availabilityStatus !== undefined && { availabilityStatus }),
        ...(salaryExpectation !== undefined && { salaryExpectation }),
        ...(modalityPreference !== undefined && { modalityPreference }),
        progress: Math.max(existing.progress ?? 0, completeness),
        updatedAt: new Date(),
      })
      .where(eq(professionalProfiles.userId, userId))
      .returning();

    return NextResponse.json({ success: true, profile: updated[0] });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Helper: Safe JSON parse
function safeParseJSON(value: string | null): unknown[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// Helper: Calculate profile completeness (10-50 range, base from onboarding)
function calculateProfileCompleteness(data: Record<string, unknown>): number {
  let score = 10; // base from onboarding
  const fields = [
    { key: "headline", weight: 5 },
    { key: "summary", weight: 5 },
    { key: "title", weight: 3 },
    { key: "bio", weight: 3 },
    { key: "experienceYears", weight: 2 },
    { key: "linkedinUrl", weight: 4 },
    { key: "portfolioUrl", weight: 3 },
    { key: "workExperience", weight: 5 },
    { key: "education", weight: 5 },
    { key: "certifications", weight: 3 },
    { key: "languages", weight: 2 },
  ];

  for (const field of fields) {
    const val = data[field.key];
    if (val && (typeof val !== "string" || val.trim() !== "")) {
      if (Array.isArray(val) && val.length > 0) {
        score += field.weight;
      } else if (!Array.isArray(val)) {
        score += field.weight;
      }
    }
  }

  return Math.min(score, 50); // Profile fills up to 50%, rest from learning
}

// Helper: Calculate employability score (0-100)
interface ProfileData {
  headline: string | null;
  summary: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  workExperience: string | null;
  education: string | null;
  certifications: string | null;
  languages: string | null;
  experienceYears: number | null;
  availabilityStatus: string | null;
}

interface SkillData {
  isValidated: boolean;
}

function calculateEmployabilityScore(
  profile: ProfileData,
  skills: SkillData[],
  completedModules: number,
  totalModules: number
): number {
  let score = 0;

  // Profile completeness (30 points max)
  if (profile.headline) score += 5;
  if (profile.summary) score += 5;
  if (profile.linkedinUrl) score += 3;
  if (profile.portfolioUrl) score += 2;
  if (profile.workExperience) {
    const exp = safeParseJSON(profile.workExperience);
    score += Math.min(exp.length * 3, 9);
  }
  if (profile.education) {
    const edu = safeParseJSON(profile.education);
    score += Math.min(edu.length * 2, 6);
  }

  // Skills (20 points max)
  const validatedSkills = skills.filter(s => s.isValidated).length;
  score += Math.min(skills.length * 2, 10);
  score += Math.min(validatedSkills * 3, 10);

  // Learning progress (30 points max)
  if (totalModules > 0) {
    score += Math.round((completedModules / totalModules) * 30);
  }

  // Certifications & Languages (10 points max)
  if (profile.certifications) {
    const certs = safeParseJSON(profile.certifications);
    score += Math.min(certs.length * 3, 6);
  }
  if (profile.languages) {
    const langs = safeParseJSON(profile.languages);
    score += Math.min(langs.length * 2, 4);
  }

  // Availability bonus (10 points max)
  if (profile.availabilityStatus === "disponible") score += 10;
  else if (profile.availabilityStatus === "en_proceso") score += 5;

  return Math.min(score, 100);
}
