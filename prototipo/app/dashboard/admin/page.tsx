"use client";

import { 
  Users, 
  Calendar, 
  TrendingUp,
  ShieldCheck,
  Plus,
  BarChart3,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

const stats = [
  { label: "Total Usuarios", value: "842", subtitle: "Profesionales + Empresas", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Nuevos Hoy", value: "+12", subtitle: "Registro últimas 24h", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Eventos Activos", value: "5", subtitle: "Próximos webinars", icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Validaciones", value: "24", subtitle: "Perfiles por revisar", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
];

export default function AdminDashboard() {
  authClient.useSession();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Administración</h1>
          <p className="text-gray-500 font-medium text-lg">Gestiona la Red de Bienestar Laboral.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Nuevo Evento
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4 }}
            className="saas-card p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-xs font-medium text-gray-400">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart Placeholder */}
        <div className="saas-card p-8 space-y-8">
          <div className="flex items-center gap-3">
             <BarChart3 className="w-5 h-5 text-blue-600" />
             <h2 className="text-lg font-bold text-gray-900">Crecimiento de la Red</h2>
          </div>
          <div className="h-64 bg-gray-50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
             <p className="text-gray-400 font-medium">[ Gráfico de Crecimiento ]</p>
          </div>
        </div>

        {/* Pending Tasks / Verifications */}
        <div className="saas-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-purple-600" />
               <h2 className="text-lg font-bold text-gray-900">Validaciones Pendientes</h2>
            </div>
            <Badge className="bg-purple-100 text-purple-700">24 por revisar</Badge>
          </div>
          
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">
                        P{i}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-gray-900">Usuario Pendiente {i}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Profesional +45</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="px-3 py-1.5 text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all">Validar</button>
                     <button className="p-1.5 text-gray-300 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
          </div>
          <button className="w-full py-3 text-sm font-bold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all">
            Ver Todas las Solicitudes
          </button>
        </div>
      </div>
    </div>
  );
}
