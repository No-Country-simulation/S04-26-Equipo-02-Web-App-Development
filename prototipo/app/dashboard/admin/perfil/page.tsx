"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  Mail, 
  ShieldCheck,
  Camera,
  Link2,
  Loader2,
  X,
  Building2,
  Pencil,
  Info,
  Save
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AdminPerfilPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    bio: "",
    linkedinUrl: "",
    location: "",
  });

  // Load profile data
  useEffect(() => {
    async function loadData() {
        try {
            const res = await fetch("/api/admin/profile");
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    bio: data.bio || "",
                    linkedinUrl: data.linkedinUrl || "",
                    location: data.location || user?.location || "",
                });
            }
        } catch (err) {
            console.error("Error loading admin profile:", err);
        }
    }
    if (user) loadData();
  }, [user]);

  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) {
      toast.error("Por favor ingresa una URL de imagen");
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
        toast.success("¡Avatar actualizado!");
        setShowAvatarInput(false);
        setAvatarUrl("");
        await authClient.getSession({ query: { disableCookieCache: true } });
      } else {
        toast.error("Error al actualizar avatar");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("¡Perfil actualizado con éxito!");
        setIsEditing(false);
        // Refresh session to get updated location if changed
        await authClient.getSession({ query: { disableCookieCache: true } });
      } else {
        toast.error("Error al guardar los cambios");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B9E6B]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Perfil */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-8 pb-10 border-b border-[#EDE8DB]">
        <div className="relative group">
          <Avatar className="w-32 h-32 rounded-[2rem] shadow-2xl border-4 border-white ring-1 ring-black/5">
            {user.image && (
              <AvatarImage 
                src={user.image} 
                alt={user.name} 
                className="object-cover" 
              />
            )}
            <AvatarFallback className="bg-[#2C2C2C] text-white text-4xl font-black">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => setShowAvatarInput(!showAvatarInput)}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-[2rem] flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          <div className="absolute -bottom-2 -right-2 p-2 bg-[#7B9E6B] rounded-2xl shadow-lg border-2 border-white">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tight">{user.name}</h1>
            <Badge className="bg-[#2C2C2C] text-white border-0 font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
              {user.role === "SUPER_ADMIN" ? "Super Admin" : "Administrador"}
            </Badge>
          </div>
          <p className="text-[#9B9B9B] font-medium text-lg flex items-center gap-2">
            <Mail className="w-5 h-5" /> {user.email}
          </p>
          <div className="flex items-center gap-2 text-[#7B9E6B] font-bold text-sm bg-[#7B9E6B]/10 w-fit px-3 py-1 rounded-lg">
             <Building2 className="w-4 h-4" /> Red de Bienestar Laboral
          </div>
        </div>

        <div className="flex gap-3">
            {!isEditing ? (
                <Button 
                    onClick={() => setIsEditing(true)}
                    className="rounded-2xl font-bold bg-[#7B9E6B] hover:bg-[#6B8E5B] text-white px-6"
                >
                    <Pencil className="w-4 h-4 mr-2" /> Editar Perfil
                </Button>
            ) : (
                <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="rounded-2xl font-bold bg-[#2C2C2C] hover:bg-black text-white px-6"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Guardar Cambios
                </Button>
            )}
        </div>
      </div>

      {/* Avatar URL Input */}
      <AnimatePresence>
        {showAvatarInput && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-2 border-[#7B9E6B]/20 bg-white rounded-[2rem] shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[#7B9E6B]/10 rounded-2xl text-[#7B9E6B] shrink-0">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="font-black text-[#1A1A1A] text-xl">Foto de Perfil</h3>
                      <p className="text-sm text-[#6B6B6B] mt-1">Pega la URL de tu foto profesional.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
                        <Input 
                          type="url"
                          placeholder="https://tu-foto.com/avatar.jpg"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="pl-11 h-14 rounded-2xl border-[#EDE8DB] bg-[#F5F0E8]/30"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateAvatar}
                        disabled={isUpdating || !avatarUrl.trim()}
                        className="h-14 px-8 rounded-2xl bg-[#2C2C2C] hover:bg-black text-white font-bold"
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowAvatarInput(false); setAvatarUrl(""); }} className="h-14 w-14 rounded-2xl p-0">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Bio & LinkedIn Section */}
         <Card className="bg-white rounded-[2rem] p-8 border border-[#EDE8DB] shadow-sm space-y-6">
            <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest">Información Personal</h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#9B9B9B] uppercase">Biografía</p>
                  {isEditing ? (
                    <Textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Escribe algo sobre ti..."
                        className="min-h-[100px] rounded-xl border-[#EDE8DB] bg-[#F5F0E8]/30"
                    />
                  ) : (
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">
                        {formData.bio || "No se ha agregado una biografía."}
                    </p>
                  )}
               </div>

               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#9B9B9B] uppercase">Perfil de LinkedIn (URL)</p>
                  {isEditing ? (
                    <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
                        <Input 
                            value={formData.linkedinUrl}
                            onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                            placeholder="https://linkedin.com/in/perfil"
                            className="pl-10 h-11 rounded-xl border-[#EDE8DB] bg-[#F5F0E8]/30"
                        />
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-[#0A66C2] truncate">
                        {formData.linkedinUrl || "No vinculado"}
                    </p>
                  )}
               </div>
            </div>
         </Card>

         {/* Location & Roles Section */}
         <Card className="bg-[#EDE8DB] rounded-[2rem] p-8 border border-[#D4C9A8]/30 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
               <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-[#8B9A6B]" />
               </div>
               <h3 className="text-xl font-black text-[#1A1A1A]">Datos de Ubicación</h3>
               <p className="text-sm text-[#6B6B6B] font-medium leading-relaxed">
                  Tu ubicación ayuda a contextualizar tu zona de gestión en la red.
               </p>
               
               <div className="pt-4">
                   <p className="text-[10px] font-bold text-[#9B9B9B] uppercase mb-2">Ubicación Actual</p>
                   {isEditing ? (
                        <Input 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Ej: Buenos Aires, AR"
                            className="h-11 rounded-xl border-[#D4C9A8]/50 bg-white/50"
                        />
                   ) : (
                        <div className="p-4 bg-white/40 rounded-2xl border border-white/20">
                            <p className="text-sm font-bold text-[#1A1A1A]">{user.location || "No especificada"}</p>
                        </div>
                   )}
               </div>
            </div>

            <div className="mt-8 flex items-center gap-3 p-4 bg-black/5 rounded-2xl border border-black/5">
                <ShieldCheck className="w-5 h-5 text-[#8B9A6B]" />
                <div>
                    <p className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest leading-none">Cuenta Protegida</p>
                    <p className="text-[9px] text-[#6B6B6B] font-medium mt-1">El nombre y correo institucional no pueden editarse.</p>
                </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
