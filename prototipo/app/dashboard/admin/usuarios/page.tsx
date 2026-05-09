"use client";

import { Users, Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUsuariosPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" /> Gestión de Usuarios
        </h1>
        <p className="text-gray-500 text-lg">Administra profesionales y empresas registradas en la red.</p>
      </div>

      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Buscar por nombre o email..." className="pl-10 h-12 rounded-xl" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Usuario</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Rol</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-8 py-6">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">A</div>
                  Ana Carolina Corbelle
                </div>
                <div className="text-xs text-gray-400 font-medium ml-10">ana@ejemplo.com</div>
              </td>
              <td className="px-8 py-6">
                <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Admin</span>
              </td>
              <td className="px-8 py-6 text-sm font-bold text-emerald-600">Verificado</td>
              <td className="px-8 py-6 text-right">
                <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
