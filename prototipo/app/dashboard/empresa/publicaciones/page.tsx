"use client";

import { FileText, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicacionesPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-600" /> Mis Publicaciones
          </h1>
          <p className="text-gray-500 text-lg">Gestiona tus vacantes y procesos de selección.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2">
          <Plus className="w-6 h-6" /> Nueva Vacante
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <Rocket className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900">Aún no tienes publicaciones</h3>
        <p className="text-gray-500 max-w-sm mx-auto font-medium italic">¡Comienza publicando tu primera oportunidad para el talento +45!</p>
      </div>
    </div>
  );
}
