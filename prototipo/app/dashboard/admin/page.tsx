"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  TrendingUp,
  ShieldCheck,
  Plus,
  BarChart3,
  MoreVertical,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

interface AdminMetrics {
  users: { total: number };
  events: { active: number };
}

export default function AdminDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          setMetrics(await res.json());
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const stats = metrics ? [
    { label: "Total Usuarios", value: metrics.users.total, subtitle: "Profesionales + Empresas", icon: Users, color: "text-[#7B9E6B]", bg: "bg-[#7B9E6B]/10" },
    { label: "Registros Hoy", value: "+0", subtitle: "Próximas 24h", icon: TrendingUp, color: "text-[#D4826A]", bg: "bg-[#D4826A]/10" },
    { label: "Eventos Activos", value: metrics.events.active, subtitle: "Próximos webinars", icon: Calendar, color: "text-[#C4A962]", bg: "bg-[#C4A962]/10" },
    { label: "Validaciones", value: "0", subtitle: "Perfiles por revisar", icon: ShieldCheck, color: "text-[#8B9A6B]", bg: "bg-[#8B9A6B]/10" },
  ] : [];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#2C2C2C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header — Hello, Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight">
             Hola, {user?.name?.split(' ')[0]} 
           </h1>
           <p className="text-[#9B9B9B] font-medium text-xs uppercase tracking-widest">
             Panel de Control — Administración
           </p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/dashboard/admin/eventos">
            <button className="flex items-center gap-2 px-5 py-3 bg-[#2C2C2C] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg text-sm">
              <Plus className="w-4 h-4 text-[#7B9E6B]" />
              Nuevo Evento
            </button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ADMIN PHOTO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 relative rounded-[2rem] overflow-hidden shadow-sm group cursor-pointer min-h-[210px] max-w-[190px]"
        >
          <div className="absolute inset-0">
            <Image 
              src={user?.image || "/default-professional.png"}
              alt={user?.name || "Administrador"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-3 py-1 m-3 z-10 text-left rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="text-sm font-black text-white tracking-tight leading-tight">
              {user?.name}
            </h2>
            <p className="text-white/60 font-semibold text-[9px] uppercase tracking-wider">
              Red de Bienestar
            </p>
          </div>
        </motion.div>

        {/* COMPACT STATS GRID */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white rounded-3xl p-5 border border-[#EDE8DB] shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:rotate-6 duration-300", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <MoreVertical className="w-4 h-4 text-gray-300" />
              </div>
              <div className="mt-4 space-y-0.5">
                <h3 className="text-2xl font-black text-[#1A1A1A]">
                  {stat.value}
                </h3>
                <p className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-widest">{stat.label}</p>
                <p className="text-[9px] font-medium text-[#6B6B6B] leading-none opacity-60">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-6 space-y-6 border border-[#EDE8DB] shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#EDE8DB] rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#2C2C2C]" />
             </div>
             <div>
                <h2 className="text-base font-black text-[#1A1A1A]">Crecimiento</h2>
                <p className="text-[10px] text-[#9B9B9B] font-medium">Estadísticas de registros</p>
             </div>
          </div>
          <div className="h-48 bg-[#F5F0E8]/50 rounded-3xl flex items-center justify-center border-2 border-dashed border-[#D4C9A8]/30">
             <p className="text-[#9B9B9B] font-bold text-[10px] uppercase tracking-widest italic opacity-50">[ Gráfico de Crecimiento ]</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 space-y-6 border border-[#EDE8DB] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-[#8B9A6B]/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#8B9A6B]" />
               </div>
               <div>
                  <h2 className="text-base font-black text-[#1A1A1A]">Validaciones</h2>
                  <p className="text-[10px] text-[#9B9B9B] font-medium">Revisión de perfiles</p>
               </div>
            </div>
            <Badge className="bg-[#EDE8DB] text-[#6B6B6B] border-0 rounded-lg px-2 py-0.5 text-[9px] font-bold">24 pendientes</Badge>
          </div>
          
          <div className="space-y-3">
             {[1, 2].map((i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-[#F5F0E8]/30 rounded-2xl border border-[#EDE8DB]/50 hover:bg-white hover:shadow-lg transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white border border-[#EDE8DB] flex items-center justify-center font-black text-xs text-[#9B9B9B]">
                        U{i}
                     </div>
                     <div>
                        <p className="text-xs font-black text-[#1A1A1A]">Usuario Pendiente {i}</p>
                        <p className="text-[9px] text-[#9B9B9B] uppercase font-bold tracking-widest mt-0.5">Profesional +45</p>
                     </div>
                  </div>
                  <button className="px-3 py-1.5 text-[9px] font-black bg-white border border-[#EDE8DB] text-[#1A1A1A] uppercase tracking-widest rounded-lg hover:bg-[#2C2C2C] hover:text-white transition-all shadow-sm">Validar</button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
