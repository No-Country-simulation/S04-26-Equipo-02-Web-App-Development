"use client";

import { Map, Compass, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RutaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Map className="w-8 h-8 text-blue-600" /> Mi Ruta de Aprendizaje
        </h1>
        <p className="text-gray-500 text-lg">Tu camino personalizado hacia la reinvención profesional.</p>
      </div>

      <div className="space-y-6">
        <Card className="saas-card border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              <span>Fase 1: Autoconocimiento y Diagnóstico</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">¡Felicidades! Has completado tu diagnóstico inicial. Este es el primer paso para entender tus fortalezas.</p>
          </CardContent>
        </Card>

        <Card className="saas-card opacity-60">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-3">
              <Compass className="w-5 h-5 text-blue-600" /> Fase 2: Fortalecimiento de Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Próximamente: Aquí verás los talleres y cursos recomendados según tu perfil.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
