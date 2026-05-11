"use client";

import { 
  Settings, 
  Bell, 
  Lock, 
  Database,
  ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#2C2C2C]" /> Configuración Global
        </h1>
        <p className="text-[#9B9B9B] text-lg font-medium">Ajustes técnicos y de seguridad del panel administrativo.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Notificaciones */}
        <Card className="bg-white rounded-[2rem] border border-[#EDE8DB] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB] p-8">
            <div className="flex items-center gap-3">
               <Bell className="w-5 h-5 text-[#D4826A]" />
               <CardTitle className="text-sm font-black text-[#9B9B9B] uppercase tracking-widest">Notificaciones de Sistema</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-[#1A1A1A]">Nuevos Registros</Label>
                <p className="text-sm text-[#9B9B9B]">Recibir un correo por cada nuevo profesional que se registre.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-[#1A1A1A]">Reportes Semanales</Label>
                <p className="text-sm text-[#9B9B9B]">Enviar resumen de métricas todos los lunes a las 9:00 AM.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="bg-white rounded-[2rem] border border-[#EDE8DB] shadow-sm overflow-hidden">
          <CardHeader className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB] p-8">
            <div className="flex items-center gap-3">
               <Lock className="w-5 h-5 text-[#8B9A6B]" />
               <CardTitle className="text-sm font-black text-[#9B9B9B] uppercase tracking-widest">Seguridad y Acceso</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-[#1A1A1A]">Autenticación de Dos Pasos (2FA)</Label>
                <p className="text-sm text-[#9B9B9B]">Requerir código de seguridad adicional para entrar al panel.</p>
              </div>
              <Button variant="outline" className="rounded-xl border-[#EDE8DB] font-bold text-xs uppercase tracking-widest">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-[#1A1A1A]">Sesiones Activas</Label>
                <p className="text-sm text-[#9B9B9B]">Cerrar sesión en todos los demás dispositivos.</p>
              </div>
              <Button variant="ghost" className="text-red-500 font-bold hover:bg-red-50 rounded-xl">Cerrar todo</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-50/30 rounded-[2rem] border border-red-100 shadow-sm overflow-hidden">
           <CardHeader className="bg-red-50 border-b border-red-100 p-8">
            <div className="flex items-center gap-3">
               <ShieldAlert className="w-5 h-5 text-red-600" />
               <CardTitle className="text-sm font-black text-red-900 uppercase tracking-widest">Zona Crítica</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex items-center justify-between">
             <div className="space-y-0.5">
                <h4 className="text-base font-bold text-red-900">Mantenimiento de Base de Datos</h4>
                <p className="text-sm text-red-700/60 font-medium">Limpia registros antiguos y optimiza el rendimiento del sistema.</p>
             </div>
             <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 font-bold">
                <Database className="w-4 h-4 mr-2" /> Optimizar
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
