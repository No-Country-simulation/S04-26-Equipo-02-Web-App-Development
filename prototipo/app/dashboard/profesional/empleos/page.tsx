"use client";

import { Briefcase, Search, Filter, Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmpleosPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-600" /> Marketplace de Oportunidades
        </h1>
        <p className="text-gray-500 text-lg">Descubre vacantes en empresas que valoran la experiencia Senior.</p>
      </div>

      <div className="flex gap-4 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar por cargo o empresa..." className="pl-10 h-12 rounded-xl" />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl border-2 flex items-center gap-2 font-bold text-gray-600">
          <Filter className="w-4 h-4" /> Filtros
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <Rocket className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900">Estamos preparando las mejores vacantes</h3>
        <p className="text-gray-500 max-w-sm mx-auto font-medium">Muy pronto podrás postularte a empresas que buscan tu liderazgo y experiencia.</p>
      </div>
    </div>
  );
}
