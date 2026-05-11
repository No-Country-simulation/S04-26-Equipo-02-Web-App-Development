"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Avatar, 
  AvatarFallback,
  AvatarImage, 
} from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  ChevronRight,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserButtonProps {
  isCollapsed: boolean;
}

export default function UserButton({ isCollapsed }: UserButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  // Mapeo de roles a nombres amigables
  const roleNames: Record<string, string> = {
    PROFESSIONAL: "Profesional",
    COMPANY: "Empresa",
    ADMIN: "Administrador",
    SUPER_ADMIN: "Super Admin"
  };

  const userRoleName = roleNames[user?.role || ""] || "Miembro";

  // Iniciales dinámicas
  const getInitials = (name: string = "") => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/login");
          },
        },
      });
    } catch (err: unknown) {
      console.error("Logout error:", err);
    }
  };

  if (!user) return null;

  return (
    <div className={cn(
      "w-full transition-all duration-150",
      isCollapsed ? "px-2" : "px-0"
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <button className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 group relative outline-none",
            isCollapsed ? "justify-center" : "text-left"
          )}>
             <Avatar className="h-9 w-9 shrink-0 rounded-xl border border-[#7B9E6B]/50 shadow-[0_0_10px_2px_rgba(123,158,107,0.4)]">
                {user.image && <AvatarImage src={user.image} alt={user.name} className="object-cover" />}
                <AvatarFallback className="bg-[#7B9E6B]/20 text-[#7B9E6B] text-[10px] font-bold rounded-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
             </Avatar>
             
             <AnimatePresence mode="wait">
               {!isCollapsed && (
                 <motion.div 
                   initial={{ opacity: 0, width: 0 }}
                   animate={{ opacity: 1, width: "auto" }}
                   exit={{ opacity: 0, width: 0 }}
                   className="flex-1 min-w-0 overflow-hidden"
                 >
                   <p className="text-sm font-bold text-white truncate tracking-tight">{user?.firstName?.split(" ")[0]} {user?.lastName}</p>
                   <p className="text-[11px] font-medium text-white/40 truncate mt-0.5">{userRoleName}</p>
                 </motion.div>
               )}
             </AnimatePresence>

             {!isCollapsed && (
               <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
             )}

             {isCollapsed && (
               <div className="absolute left-[calc(100%+8px)] px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-3 z-[100] whitespace-nowrap shadow-xl">
                  {user.name}
               </div>
             )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl border-white/10 bg-black text-white" align={isCollapsed ? "center" : "end"} side="right" sideOffset={isCollapsed ? 12 : 8}>
           {/* <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10 border border-white/10 rounded-xl">
                    {user.image && <AvatarImage src={user.image} alt={user.name} className="object-cover" />}
                    <AvatarFallback className="bg-blue-600 text-white font-bold text-xs uppercase rounded-xl">
                       {getInitials(user.name)}
                    </AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col min-w-0">
                    <p className="text-sm font-black text-white truncate tracking-tight leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] text-white/40 truncate font-medium">{user.email}</p>
                 </div>
              </div>
           </DropdownMenuLabel> */}
           {/* <DropdownMenuSeparator className="mx-2 bg-white/5" /> */}
           
           {/* Perfil Link dinámico según Rol */}
           <Link href={
             user.role === "ADMIN" || user.role === "SUPER_ADMIN" 
               ? "/dashboard/admin/perfil" 
               : user.role === "COMPANY" 
                 ? "/dashboard/empresa/perfil" 
                 : "/dashboard/profesional/perfil"
           }>
              <DropdownMenuItem className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-white/5 focus:text-white group">
                 <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/40 group-focus:text-blue-400 transition-all">
                    <Settings className="w-4 h-4" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold text-sm">Mi Perfil</span>
                    <span className="text-[9px] text-white/40 font-medium">Gestionar cuenta y seguridad</span>
                 </div>
              </DropdownMenuItem>
           </Link>

           <DropdownMenuSeparator className="mx-2 bg-white/5" />
           
           <DropdownMenuItem 
             onClick={handleLogout}
             className="rounded-xl p-3 flex items-center gap-3 cursor-pointer text-red-400 focus:bg-white/5 focus:text-red-400 transition-all font-bold"
           >
              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                 <LogOut className="w-4 h-4" />
              </div>
              Cerrar Sesión
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
