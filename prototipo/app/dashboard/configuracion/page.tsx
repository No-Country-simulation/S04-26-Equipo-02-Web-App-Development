"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ConfigurationPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // Usamos el cliente de Better Auth para el cambio de clave
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Error al cambiar la contraseña");
      } else {
        setSuccess(true);
        toast.success("¡Contraseña actualizada con éxito!");
        
        // Disparamos el email de confirmación (vía API interna)
        await fetch("/api/confirm-password-change", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: user?.email,
            name: user?.name 
          }),
        });

        // Limpiar campos
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      console.error("Change Password Error:", err);
      toast.error("Hubo un problema procesando tu solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md p-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">¡Contraseña Actualizada!</h1>
          <p className="text-gray-500">Tu cuenta ahora es más segura. Te hemos enviado un email confirmando el cambio.</p>
          <Button 
            onClick={() => window.location.href = "/dashboard"} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-2xl font-bold text-lg group"
          >
            Ir al Dashboard 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">Seguridad de Cuenta</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configuración</h1>
        <p className="text-gray-500">Gestiona tu contraseña y protege tu cuenta en la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl shadow-indigo-100/30 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Cambiar Contraseña</CardTitle>
                  <CardDescription className="text-indigo-100 mt-1">
                    Crea una clave segura de al menos 8 caracteres.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Contraseña Actual</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input 
                      type={showCurrent ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-12 py-7 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-2xl"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                    >
                      {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nueva Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input 
                        type={showNew ? "text" : "password"} 
                        placeholder="Mínimo 8 caracteres" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-12 py-7 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-2xl"
                        required
                        minLength={8}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                      >
                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Confirmar Nueva Contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 py-7 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-2xl"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-7 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Guardando cambios...
                    </>
                  ) : (
                    "Guardar Nueva Contraseña"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-6">
          <Card className="border-none bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-bold text-orange-900">Seguridad Requerida</h4>
                <p className="text-sm text-orange-800/70 leading-relaxed">
                  Para proteger tu cuenta, requerimos que cambies la contraseña temporal que te enviamos por correo.
                </p>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <h4 className="font-bold text-gray-900 mb-4 px-2">Tips de Seguridad</h4>
             <ul className="space-y-4">
                {[
                  "Usa más de 8 caracteres.",
                  "Incluye números y símbolos.",
                  "No uses claves de otros sitios.",
                  "Cámbiala cada 6 meses."
                ].map((tip, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    {tip}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
