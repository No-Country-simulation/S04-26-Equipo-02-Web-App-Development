"use client";

import { Search, UserCheck } from "lucide-react";

export default function TalentoPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-blue-600" /> Búsqueda de Talento
        </h1>
        <p className="text-gray-500 text-lg">Encuentra profesionales con la experiencia y sabiduría que tu empresa necesita.</p>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <Search className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900">Base de Talento en Preparación</h3>
        <p className="text-gray-500 max-w-sm mx-auto font-medium italic">Estamos validando perfiles profesionales para asegurar la mejor calidad de match.</p>
      </div>
    </div>
  );
}
