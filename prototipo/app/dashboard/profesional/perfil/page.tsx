"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  Mail, 
  UserCircle2,
  MapPin,
  Phone,
  Briefcase,
  Building2,
  ShieldCheck,
  Calendar,
  Award,
  Camera,
  Link2,
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function PerfilPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) {
      toast.error("Por favor ingresa una URL de imagen");
      return;
    }

    // Basic URL validation
    try {
      new URL(avatarUrl);
    } catch {
      toast.error("La URL ingresada no es válida");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/professional/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: avatarUrl }),
      });

      if (res.ok) {
        toast.success("¡Avatar actualizado con éxito!");
        setShowAvatarInput(false);
        setAvatarUrl("");
        // Refresh the session to get the updated image
        await authClient.getSession({ query: { disableCookieCache: true } });
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al actualizar el avatar");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium italic">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  const role = user.role || "PROFESSIONAL";
  const isProfessional = role === "PROFESSIONAL";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-in fade-in duration-700">
      
      {/* Header Perfil */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-6 border-b border-gray-100">
        <div className="relative group">
          {/* Avatar con imagen real o fallback */}
          <Avatar className="w-24 h-24 rounded-3xl shadow-xl shadow-primary/20 border-4 border-white">
            {user.image && (
              <AvatarImage 
                src={user.image} 
                alt={user.name} 
                className="object-cover rounded-3xl" 
              />
            )}
            <AvatarFallback className="bg-primary text-white text-4xl font-black rounded-3xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Botón de cambiar avatar (overlay) */}
          <button
            onClick={() => setShowAvatarInput(!showAvatarInput)}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-3xl flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          {/* Badge de rol */}
          <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-xl shadow-lg border border-gray-50">
            {isProfessional ? <UserCircle2 className="w-5 h-5 text-primary" /> : <Building2 className="w-5 h-5 text-primary" />}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user.name}</h1>
          </div>
          <p className="text-gray-500 font-medium text-lg flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
        </div>
      </div>

      {/* Input de Avatar URL (desplegable) */}
      <AnimatePresence>
        {showAvatarInput && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-blue-100 bg-blue-50/30 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Actualizar tu Foto de Perfil</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Pega la URL de tu foto (desde LinkedIn, Google, o cualquier servicio de imágenes).
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          type="url"
                          placeholder="https://tu-foto.com/avatar.jpg"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateAvatar}
                        disabled={isUpdating || !avatarUrl.trim()}
                        className="h-12 px-6 rounded-xl bg-[#003366] hover:bg-blue-900 font-bold shadow-md"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Guardar
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => { setShowAvatarInput(false); setAvatarUrl(""); }}
                        className="h-12 w-12 rounded-xl p-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    {/* Preview */}
                    {avatarUrl && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase">Preview:</span>
                        <Avatar className="w-10 h-10 rounded-lg border border-gray-200">
                          <AvatarImage src={avatarUrl} alt="Preview" className="object-cover" />
                          <AvatarFallback className="bg-gray-100 text-gray-400 text-xs rounded-lg">?</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500 truncate max-w-xs">{avatarUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información de Contacto */}
        <div className="space-y-6">
          <Card className="saas-card p-6 space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ubicación</p>
                  <p className="text-sm font-bold text-gray-900">{user.location || "No especificada"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Teléfono</p>
                  <p className="text-sm font-bold text-gray-900">{user.phone || "No especificado"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary uppercase mb-1">Estado de Cuenta</p>
                <p className="text-sm text-primary/70 leading-relaxed font-medium">
                  Tu perfil ha sido validado correctamente por el equipo de administración de la Red.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Detalles Específicos */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="saas-card overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl font-bold">Detalles Profesionales</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rol Principal</p>
                  <p className="text-lg font-bold text-gray-900">{isProfessional ? "Especialista Senior" : "Reclutador Corporativo"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Miembro desde</p>
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Mayo 2026
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Habilidades Destacadas</p>
                <div className="flex flex-wrap gap-2">
                  {["Liderazgo", "Gestión de Equipos", "Estrategia", "Mentoría"].map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-4 py-2 bg-gray-50 text-gray-600 border-gray-100 rounded-xl font-bold">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Sello de Experiencia Validada</p>
                  <p className="text-xs text-emerald-700 font-medium">Este usuario cuenta con más de 15 años de trayectoria en su sector.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
