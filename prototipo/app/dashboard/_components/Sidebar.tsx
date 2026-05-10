"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  Briefcase, 
  Calendar,
  Settings,
  ChevronLeft,
  Search,
  FileText,
  BarChart3,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserButton from "./UserButton";
import Image from "next/image";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

// Definimos la navegación por roles
const navigationByRole: Record<string, NavItem[]> = {
  PROFESSIONAL: [
    { name: "Dashboard", href: "/dashboard/profesional", icon: LayoutDashboard },
    { name: "Mi Perfil", href: "/dashboard/profesional/perfil", icon: User },
    { name: "Mi Ruta", href: "/dashboard/profesional/ruta", icon: GraduationCap },
    { name: "Marketplace", href: "/dashboard/profesional/empleos", icon: Briefcase },
    { name: "Eventos", href: "/dashboard/profesional/eventos", icon: Calendar },
  ],
  COMPANY: [
    { name: "Dashboard", href: "/dashboard/empresa", icon: LayoutDashboard },
    { name: "Buscar Talento", href: "/dashboard/empresa/talento", icon: Search },
    { name: "Mis Publicaciones", href: "/dashboard/empresa/publicaciones", icon: FileText },
    { name: "Perfil Empresa", href: "/dashboard/empresa/perfil", icon: User },
  ],
  ADMIN: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Eventos", href: "/dashboard/admin/eventos", icon: Calendar },
    { name: "Usuarios", href: "/dashboard/admin/usuarios", icon: Users },
    { name: "Métricas", href: "/dashboard/admin/metricas", icon: BarChart3 },
  ],
  SUPER_ADMIN: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Eventos", href: "/dashboard/admin/eventos", icon: Calendar },
    { name: "Usuarios", href: "/dashboard/admin/usuarios", icon: Users },
    { name: "Configuración", href: "/dashboard/admin/settings", icon: Settings },
  ]
};

interface SidebarProps {
  setIsOpen: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  className?: string;
}

export default function Sidebar({ setIsOpen, isCollapsed, setIsCollapsed, className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  // Obtenemos la navegación según el rol del usuario (default: PROFESSIONAL)
  const userRole = user?.role || "PROFESSIONAL";
  const navigation = navigationByRole[userRole] || navigationByRole.PROFESSIONAL;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "relative h-screen bg-black border-r border-white/10 flex flex-col transition-all duration-300 z-30",
        className
      )}
    >
      {/* Header / Brand */}
      <div className={cn(
        "h-20 flex items-center border-b border-white/5 transition-all duration-150",
        isCollapsed ? "justify-center px-0" : "justify-between px-6"
      )}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-full transition-transform group-hover:scale-105">
            <Image 
              src="/logo-espera.png" 
              alt="Logo Red de Bienestar Laboral" 
              fill
              className="object-contain"
            />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.2, duration: 0.3, ease: "easeOut" }
                }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                className="flex items-center"
              >
                <div className="relative h-16 w-32 ml-2">
                   <Image 
                    src="/logo-letra.png" 
                    alt="Red de Bienestar Laboral" 
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        
        {/* Toggle Button Desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white self-center absolute -right-3 top-7 bg-[#2C2C2C] border border-white/10 shadow-sm z-50 transition-all"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Close Button Mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 lg:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className={cn(
        "flex-1 py-6 space-y-1 transition-all duration-150",
        isCollapsed ? "px-2 overflow-visible" : "px-4 overflow-y-auto"
      )}>
        {navigation.map((item) => {
          const isActive = item.href.endsWith("/profesional") || item.href.endsWith("/empresa") || item.href.endsWith("/admin")
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl transition-all font-semibold text-sm relative",
                isCollapsed ? "justify-center p-2.5" : "gap-3 px-4 py-3",
                isActive 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-all duration-300",
                isActive ? "text-[#7B9E6B] drop-shadow-[0_0_6px_rgba(123,158,107,0.8)]" : "text-white/40 group-hover:text-white/80"
              )} />
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden ml-1"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-[calc(100%+8px)] px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-1 group-hover:translate-x-3 z-[100] whitespace-nowrap shadow-xl">
                  {item.name}
                </div>
              )}

              {isActive && (
                <motion.div 
                  layoutId="active-nav-indicator"
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-1 h-2/5 bg-[#7B9E6B] rounded-full shadow-[0_0_8px_2px_rgba(123,158,107,0.6)]",
                    isCollapsed ? "right-0" : "left-0"
                  )}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Button Footer */}
      <div className="mt-auto p-4 border-t border-white/5">
        <UserButton isCollapsed={isCollapsed} />
      </div>

     <div className="mt-auto p-4 border-t border-white/5">
        <p className="text-white/20 text-[8px] text-center">© 2026 Red de Bienestar Laboral</p>
      </div>
    </motion.aside>
  );
}
