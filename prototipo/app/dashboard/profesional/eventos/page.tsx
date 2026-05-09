"use client";

import { Calendar, Sparkles } from "lucide-react";

export default function EventosPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-600" /> Próximos Eventos
        </h1>
        <p className="text-gray-500 text-lg">Webinars, talleres y encuentros para potenciar tu red.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="saas-card overflow-hidden group animate-pulse">
            <div className="h-40 bg-gray-100" />
            <div className="p-6 space-y-4">
               <div className="h-6 bg-gray-100 rounded w-3/4" />
               <div className="h-4 bg-gray-50 rounded w-1/2" />
               <div className="flex justify-between items-center pt-4">
                  <div className="h-8 bg-gray-100 rounded w-24" />
                  <div className="h-8 bg-gray-100 rounded w-8" />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-12">
        <p className="text-gray-400 font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" /> ¡Nuevas actividades se publican cada semana!
        </p>
      </div>
    </div>
  );
}
