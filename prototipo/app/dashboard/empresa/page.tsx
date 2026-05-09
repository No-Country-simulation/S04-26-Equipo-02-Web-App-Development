"use client";

import { Users, FileText, TrendingUp, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function CompanyDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Panel de Empresa: {user?.name}
        </h1>
        <p className="text-gray-500 font-medium text-lg">Gestiona tu búsqueda de talento Senior con propósito.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="saas-card p-6 border-l-4 border-l-blue-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-gray-900">0</h3>
               <p className="text-sm font-medium text-gray-500">Candidatos Vistos</p>
            </div>
          </div>
        </div>

        <div className="saas-card p-6 border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-gray-900">0</h3>
               <p className="text-sm font-medium text-gray-500">Vacantes Activas</p>
            </div>
          </div>
        </div>

        <div className="saas-card p-6 border-l-4 border-l-orange-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-gray-900">0</h3>
               <p className="text-sm font-medium text-gray-500">Matches Sugeridos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <Search className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900">¿Buscas talento Senior?</h3>
        <p className="text-gray-500 max-w-sm mx-auto font-medium">Estamos curando la base de profesionales más talentosa de la región.</p>
      </div>
    </div>
  );
}
