"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/auth/login");
        return;
      }

      const role = session.user.role;

      if (role === "PROFESSIONAL") {
        router.push("/dashboard/profesional");
      } else if (role === "COMPANY") {
        router.push("/dashboard/empresa");
      } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/dashboard/admin");
      } else {
        // Fallback
        router.push("/dashboard/profesional");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="h-[60vh] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Redirigiendo a tu panel personalizado...</p>
      </div>
    </div>
  );
}
