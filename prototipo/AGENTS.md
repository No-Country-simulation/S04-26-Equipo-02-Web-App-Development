<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 Environment

This project uses **Next.js 16.2.6**. 

### Critical Breaking Changes:
- **Middleware is Deprecated**: The `middleware.ts` file convention is no longer used. It has been renamed/replaced by **`proxy.ts`**. 
- **File Structure**: APIs, conventions, and file structure may differ significantly from training data.
- **Reference**: Always check `node_modules/next/dist/docs/` or `https://nextjs.org/docs/messages/middleware-to-proxy` before implementing core routing logic.
<!-- END:nextjs-agent-rules -->

# Project: Senior Talent Employability Platform (+45)

This is a "Red de Bienestar Laboral" (Workplace Wellbeing Network) designed to boost employability for professionals aged 45+.

## Core Technology Stack
- **Framework**: Next.js 16.2.6 (App Router)
- **Styling**: Tailwind CSS 4 + Shadcn UI / Radix UI
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth (Email/Password)
- **State/Animations**: Zustand + Framer Motion
- **Charts**: Recharts (Buildbox style)

## Main Modules
1. **Learning Experience**: Personalized learning paths (Digital, Socioemotional, Cognitive skills).
2. **Dynamic Profile ("CV Vivo")**: A living professional profile that updates with validated skills and platform achievements.
3. **Talent Marketplace**: Connecting senior talent with companies.
4. **Events & Community**: Webinars, workshops, and networking events.
5. **Admin Dashboard**: Real-time metrics and platform management.
