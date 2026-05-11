import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, events, eventRegistrations, jobPosts, jobApplications, talentInteractions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    // Run all aggregations in parallel
    const [
      usersCountResult,
      eventsCountResult,
      registrationsCountResult,
      jobsCountResult,
      applicationsCountResult,
      interactionsCountResult
    ] = await Promise.all([
      db.select({ 
        role: users.role, 
        count: sql<number>`count(*)` 
      }).from(users).groupBy(users.role),

      db.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.status, "active")),
      db.select({ count: sql<number>`count(*)` }).from(eventRegistrations),
      db.select({ count: sql<number>`count(*)` }).from(jobPosts).where(eq(jobPosts.status, "active")),
      db.select({ count: sql<number>`count(*)` }).from(jobApplications),
      db.select({ count: sql<number>`count(*)` }).from(talentInteractions)
    ]);

    // Format the metrics
    const rolesMap = usersCountResult.reduce((acc, curr) => {
      acc[curr.role as string] = Number(curr.count);
      return acc;
    }, {} as Record<string, number>);

    const totalUsers = Object.values(rolesMap).reduce((a, b) => a + b, 0);

    const metrics = {
      users: {
        total: totalUsers,
        professionals: rolesMap["PROFESSIONAL"] || 0,
        companies: rolesMap["COMPANY"] || 0,
        admins: (rolesMap["ADMIN"] || 0) + (rolesMap["SUPER_ADMIN"] || 0),
      },
      events: {
        active: Number(eventsCountResult[0]?.count || 0),
        totalRegistrations: Number(registrationsCountResult[0]?.count || 0),
      },
      marketplace: {
        activeJobs: Number(jobsCountResult[0]?.count || 0),
        applications: Number(applicationsCountResult[0]?.count || 0),
        interactions: Number(interactionsCountResult[0]?.count || 0),
      }
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("❌ Error fetching metrics:", error);
    return NextResponse.json({ message: "Error al calcular métricas" }, { status: 500 });
  }
}
