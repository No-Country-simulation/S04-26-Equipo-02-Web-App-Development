"use client";

import { BarChart3, TrendingUp, Users, Target } from "lucide-react";

export default function MetricasPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" /> Métricas de la Red
        </h1>
        <p className="text-gray-500 text-lg">Visualiza el crecimiento y el impacto de la comunidad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-blue-50 rounded-xl w-fit"><Users className="w-6 h-6 text-blue-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">120</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Nuevos Profesionales</p>
           </div>
        </div>
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-emerald-50 rounded-xl w-fit"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">+25%</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Crecimiento Mensual</p>
           </div>
        </div>
        <div className="saas-card p-6 space-y-4">
           <div className="p-3 bg-orange-50 rounded-xl w-fit"><Target className="w-6 h-6 text-orange-600" /></div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900">45</h3>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Matches Exitosos</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-20 text-center text-gray-400 italic font-medium">
        [ Gráficos de evolución próximamente ]
      </div>
    </div>
  );
}
