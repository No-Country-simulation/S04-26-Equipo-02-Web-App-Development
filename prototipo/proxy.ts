import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Get session using Better Auth API
    // We use a fetch to the auth API because calling auth.api directly in Edge middleware 
    // can be tricky depending on the database adapter. 
    // Better Auth documentation recommends this pattern for reliability.
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    const session = await response.json();

    // 2. If no session and trying to access dashboard, redirect to login
    if (!session && pathname.startsWith("/dashboard")) {
        const loginUrl = new URL("/auth/login", request.url);
        // Optionally save the return url
        // loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. If session exists, check role-based access
    if (session && session.user) {
        const role = session.user.role;

        // Redirect from root dashboard to specific dashboard
        if (pathname === "/dashboard") {
            if (role === "ADMIN" || role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", request.url));
            if (role === "COMPANY") return NextResponse.redirect(new URL("/dashboard/empresa", request.url));
            if (role === "PROFESSIONAL") return NextResponse.redirect(new URL("/dashboard/profesional", request.url));
        }

        // Protect admin routes
        if (pathname.startsWith("/dashboard/admin") && !(role === "ADMIN" || role === "SUPER_ADMIN")) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Protect company routes
        if (pathname.startsWith("/dashboard/empresa") && role !== "COMPANY") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Protect professional routes
        if (pathname.startsWith("/dashboard/profesional") && role !== "PROFESSIONAL") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};
