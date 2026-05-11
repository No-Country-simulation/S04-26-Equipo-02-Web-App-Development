"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart3, Users, Target, Loader2, Building, CalendarCheck, MousePointerClick } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

interface AdminMetrics {
  users: {
    total: number;
    professionals: number;
    companies: number;
    admins: number;
  };
  marketplace: {
    activeJobs: number;
    applications: number;
    interactions: number;
  };
  events: {
    active: number;
    totalRegistrations: number;
  };
}

export default function MetricasPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = useCallback(async () => {
    await Promise.resolve();
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        setMetrics(await res.json());
      } else {
        throw new Error("Error al obtener métricas");
      }
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar las métricas", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMetrics();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!metrics) return null;

  const rolesData = [
    { name: "Profesionales", value: metrics.users.professionals, color: "#3b82f6" },
    { name: "Empresas", value: metrics.users.companies, color: "#10b981" },
    { name: "Admins", value: metrics.users.admins, color: "#f59e0b" },
  ];

  const engagementData = [
    { name: "Postulaciones", value: metrics.marketplace.applications, color: "#6366f1" },
    { name: "Interacciones", value: metrics.marketplace.interactions, color: "#ec4899" },
    { name: "Inscripciones a Eventos", value: metrics.events.totalRegistrations, color: "#f97316" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" /> Métricas de la Red
        </h1>
        <p className="text-gray-500 text-lg">Visualiza el crecimiento y el impacto de la comunidad en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-blue-50 rounded-xl w-fit"><Users className="w-6 h-6 text-blue-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">{metrics.users.total}</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Usuarios Totales</p>
           </div>
        </div>
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-emerald-50 rounded-xl w-fit"><Building className="w-6 h-6 text-emerald-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">{metrics.users.companies}</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Empresas Aliadas</p>
           </div>
        </div>
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-indigo-50 rounded-xl w-fit"><Target className="w-6 h-6 text-indigo-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">{metrics.marketplace.activeJobs}</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Ofertas Activas</p>
           </div>
        </div>
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-orange-50 rounded-xl w-fit"><CalendarCheck className="w-6 h-6 text-orange-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">{metrics.events.active}</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Eventos Activos</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" /> Distribución de Roles
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rolesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {rolesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-gray-400" /> Participación (Engagement)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
