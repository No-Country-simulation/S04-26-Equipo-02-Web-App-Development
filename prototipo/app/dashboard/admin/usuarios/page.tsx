"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Loader2, 
  UserX, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Briefcase,
  Filter,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "PROFESSIONAL" | "COMPANY" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  onboardingCompleted: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ADMIN"); 
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });

  const fetchUsers = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (roleFilter && roleFilter !== "ALL") url.searchParams.set("role", roleFilter);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "10");

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar rol");
      }

      toast.success("¡Rol actualizado!", {
        description: `El usuario ahora tiene el rol de ${newRole.toLowerCase()}.`
      });
      
      fetchUsers(pagination.page);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al eliminar usuario");
      }

      toast.success("Usuario eliminado");
      fetchUsers(pagination.page);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
           <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-[#7B9E6B]" /> Usuarios
           </h1>
           <p className="text-[#9B9B9B] font-medium text-xs uppercase tracking-widest">
             Gestión de Comunidad — Red de Bienestar
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B] group-focus-within:text-[#7B9E6B] transition-colors" />
              <Input 
                placeholder="Nombre o email..." 
                className="pl-11 h-12 w-full sm:w-64 rounded-2xl border-[#EDE8DB] bg-white/50 focus:bg-white transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           
           <Select value={roleFilter} onValueChange={setRoleFilter}>
             <SelectTrigger className="h-12 w-full sm:w-48 rounded-2xl border-[#EDE8DB] bg-white font-bold text-[#1A1A1A] shadow-sm">
                <div className="flex items-center gap-2">
                   <Filter className="w-4 h-4 text-[#9B9B9B]" />
                   <SelectValue placeholder="Filtrar por..." />
                </div>
             </SelectTrigger>
             <SelectContent className="rounded-2xl border-[#EDE8DB] shadow-xl">
               <SelectItem value="ALL" className="font-bold">Todos</SelectItem>
               <SelectItem value="ADMIN" className="font-bold">Staff (Admin)</SelectItem>
               <SelectItem value="PROFESSIONAL" className="font-bold">Profesionales</SelectItem>
               <SelectItem value="COMPANY" className="font-bold">Empresas</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#EDE8DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB]">
                <th className="px-8 py-6 text-[10px] font-black text-[#9B9B9B] uppercase tracking-[0.2em]">Perfil</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9B9B9B] uppercase tracking-[0.2em]">Rol Asignado</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9B9B9B] uppercase tracking-[0.2em]">Fecha Registro</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9B9B9B] uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#9B9B9B] uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0E8]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-[#7B9E6B]" />
                      <p className="text-[#9B9B9B] font-bold text-xs uppercase tracking-widest">Sincronizando red...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                       <Users className="w-12 h-12 text-[#9B9B9B]" />
                       <p className="text-[#1A1A1A] font-black text-sm">No se encontraron usuarios</p>
                       <p className="text-xs font-medium">Prueba ajustando los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {users.map((item, idx) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-[#F5F0E8]/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12">
                            {item.image ? (
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                fill
                                className="rounded-2xl object-cover shadow-sm ring-2 ring-white" 
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#EDE8DB] rounded-2xl flex items-center justify-center text-[#9B9B9B] font-black text-lg">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg flex items-center justify-center shadow-md border border-[#EDE8DB] z-10">
                               {item.role === "COMPANY" ? <Building2 className="w-3 h-3 text-blue-500" /> : 
                                item.role === "PROFESSIONAL" ? <Briefcase className="w-3 h-3 text-emerald-500" /> : 
                                <ShieldCheck className="w-3 h-3 text-[#C4A962]" />}
                            </div>
                          </div>
                          <div>
                            <p className="font-black text-[#1A1A1A] text-sm leading-tight">{item.name}</p>
                            <p className="text-xs text-[#9B9B9B] font-medium mt-0.5">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Select 
                          value={item.role} 
                          onValueChange={(val) => handleRoleChange(item.id, val)}
                          disabled={item.role === "SUPER_ADMIN"}
                        >
                          <SelectTrigger className="w-[150px] h-9 text-[10px] font-black uppercase tracking-wider bg-[#F5F0E8]/50 border-0 rounded-xl hover:bg-white transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-[#EDE8DB] shadow-xl">
                            <SelectItem value="PROFESSIONAL" className="font-bold">Profesional</SelectItem>
                            <SelectItem value="COMPANY" className="font-bold">Empresa</SelectItem>
                            <SelectItem value="ADMIN" className="font-bold">Administrador</SelectItem>
                            <SelectItem value="SUPER_ADMIN" disabled>Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-[#9B9B9B] font-semibold text-xs">
                           <Clock className="w-3.5 h-3.5" />
                           {format(new Date(item.createdAt), "d MMM, yyyy", { locale: es })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {item.onboardingCompleted ? (
                          <Badge className="bg-[#7B9E6B]/10 text-[#7B9E6B] border-0 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                             <CheckCircle2 className="w-3 h-3" /> Verificado
                          </Badge>
                        ) : (
                          <Badge className="bg-[#C4A962]/10 text-[#C4A962] border-0 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                             <Clock className="w-3 h-3" /> Pendiente
                          </Badge>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-sm">
                              <MoreVertical className="w-4 h-4 text-[#9B9B9B]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-[#EDE8DB] shadow-xl p-2 w-48">
                            <DropdownMenuLabel className="text-[10px] font-black text-[#9B9B9B] uppercase tracking-[0.1em] px-3 py-2">Gestión</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-xl px-3 py-2 font-bold text-sm cursor-pointer hover:bg-[#F5F0E8]">
                               <Link href={`/perfil/${item.id}`}>Ver Perfil Público</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold text-sm cursor-pointer hover:bg-[#F5F0E8]">Enviar Mensaje</DropdownMenuItem>
                            {item.role !== "SUPER_ADMIN" && (
                              <>
                                <DropdownMenuSeparator className="bg-[#EDE8DB] mx-1" />
                                <DropdownMenuItem 
                                  className="rounded-xl px-3 py-2 font-bold text-sm cursor-pointer text-red-500 hover:bg-red-50 focus:text-red-500 flex items-center gap-2"
                                  onClick={() => {
                                      if (confirm(`¿Eliminar a ${item.name}? Esta acción no se puede deshacer.`)) {
                                          handleDeleteUser(item.id);
                                      }
                                  }}
                                >
                                  <UserX className="w-4 h-4" /> Eliminar Usuario
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="bg-[#F5F0E8]/30 px-8 py-6 border-t border-[#EDE8DB] flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-[0.1em]">
               Página <span className="text-[#1A1A1A]">{pagination.page}</span> de <span className="text-[#1A1A1A]">{pagination.totalPages}</span>
               <span className="mx-2 opacity-30">|</span>
               Mostrando <span className="text-[#1A1A1A]">{users.length}</span> usuarios
            </p>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
