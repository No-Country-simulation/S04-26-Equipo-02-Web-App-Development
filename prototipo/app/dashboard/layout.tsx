"use client";

import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Key, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ExtendedUser {
  mustChangePassword?: boolean;
  role?: string;
  onboardingCompleted?: boolean;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  
  const user = session?.user as ExtendedUser;
  const mustChangePassword = user?.mustChangePassword;
  
  // Redirección si el onboarding no está completado (Solo para Profesionales)
  useEffect(() => {
    if (!isSessionPending && session) {
      if (user?.role === "PROFESSIONAL" && user?.onboardingCompleted === false) {
        router.push("/onboarding");
      }
    }
  }, [session, isSessionPending, user, router]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // The auto-selection is now handled in a more stable way or is managed by the pages/sessions
  
  if (isSessionPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  // If no session after loading, better auth will usually handle redirect if protected, 
  // but we can add a check if needed.

  return (
    <div 
      className="h-screen bg-[#F5F0E8] flex overflow-hidden font-sans selection:bg-[#D4C9A8] selection:text-[#1A1A1A]"
      style={{ "--sidebar-width": isSidebarOpen ? (isCollapsed ? "80px" : "288px") : "0px" } as React.CSSProperties}
    >
      
      {/* MODERN SIDEBAR WRAPPER */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              width: isCollapsed ? 80 : 288 
            }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-y-0 left-0 md:relative md:h-full z-50 bg-[#2C2C2C] border-r border-white/5 transition-all duration-150"
          >
            <Sidebar 
              setIsOpen={setIsSidebarOpen} 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed} 
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* CLEAN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* Responsive Navbar Toggle (Mobile or when sidebar is fully closed) */}
        {!isSidebarOpen && (
          <div className="h-20 flex items-center px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm active:scale-95 group"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <span className="ml-4 text-sm font-semibold text-gray-500">Abrir Panel Lateral</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scroll-smooth relative">
          <div className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 md:py-10 transition-all duration-300">
            {mustChangePassword && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-amber-500/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                     <Key className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-amber-900">Actualiza tu contraseña</h3>
                    <p className="text-sm text-amber-700 max-w-lg">Estás usando una contraseña temporal. Por seguridad de tus datos, te recomendamos cambiarla ahora mismo.</p>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-6 py-5">
                    <Link href="/dashboard/configuracion" className="flex items-center gap-2">
                       Cambiar ahora <Key className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
           
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
