"use client";

import { Building2, Globe, Mail, MapPin, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmpresaPerfilPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
           <Building2 className="w-12 h-12 text-blue-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
          <p className="text-blue-600 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
            <Sparkles className="w-4 h-4" /> Perfil de Empresa Validado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="saas-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Datos Corporativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4" /> <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Globe className="w-4 h-4" /> <span>www.tu-empresa.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-4 h-4" /> <span>Ciudad, País</span>
            </div>
          </CardContent>
        </Card>

        <Card className="saas-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm italic">Próximamente podrás editar la bio de tu empresa para atraer al mejor talento Senior.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
