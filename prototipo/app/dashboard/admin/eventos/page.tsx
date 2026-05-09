"use client";

import { Calendar, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminEventosPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" /> Gestión de Eventos
          </h1>
          <p className="text-gray-500 text-lg">Crea y administra webinars, talleres y encuentros.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2">
          <Plus className="w-6 h-6" /> Nuevo Evento
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Evento</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-8 py-6">
                <div className="font-bold text-gray-900">Lo que buscan las empresas</div>
                <div className="text-xs text-gray-400 font-medium">BASF - Luciana Simonazzi</div>
              </td>
              <td className="px-8 py-6">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase text-[10px]">Webinar</Badge>
              </td>
              <td className="px-8 py-6 text-sm font-bold text-gray-600">20 Mayo, 18:30h</td>
              <td className="px-8 py-6">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Activo
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
