"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Building2, Globe, Mail, MapPin, Sparkles, User, Phone, Briefcase, Users, FileText, Loader2, Save, Camera, CheckCircle2, Link2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function EmpresaPerfilPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    companyName: "",
    industry: "",
    size: "",
    website: "",
    description: "",
  });

  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) {
      toast.error("Por favor ingresa una URL de imagen");
      return;
    }

    try {
      new URL(avatarUrl);
    } catch {
      toast.error("La URL ingresada no es válida");
      return;
    }

    setIsUpdatingAvatar(true);
    try {
      // Usamos el mismo endpoint que el profesional porque actualiza user.image
      const res = await fetch("/api/professional/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: avatarUrl }),
      });

      if (res.ok) {
        toast.success("¡Logo/Avatar actualizado con éxito!");
        setShowAvatarInput(false);
        setAvatarUrl("");
        await authClient.getSession({ query: { disableCookieCache: true } });
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al actualizar la imagen");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/company/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            firstName: data.user?.firstName || "",
            lastName: data.user?.lastName || "",
            email: data.user?.email || "",
            phone: data.user?.phone || "",
            location: data.user?.location || "",
            companyName: data.company?.companyName || "",
            industry: data.company?.industry || "",
            size: data.company?.size || "",
            website: data.company?.website || "",
            description: data.company?.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Perfil actualizado correctamente 🎉");
      } else {
        toast.error("Error al actualizar el perfil");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white bg-brand-bg">
            {user?.image && (
              <AvatarImage 
                src={user.image} 
                alt={formData.companyName || "Empresa"} 
                className="object-cover rounded-3xl" 
              />
            )}
            <AvatarFallback className="bg-brand-sage text-white text-3xl font-black rounded-3xl">
              {formData.companyName ? formData.companyName.charAt(0) : <Building2 className="w-10 h-10" />}
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => setShowAvatarInput(!showAvatarInput)}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-3xl flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{formData.companyName || formData.lastName || "Mi Empresa"}</h1>
          <p className="text-brand-sage font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
            <Sparkles className="w-4 h-4" /> Perfil de Empresa Validado
          </p>
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
            <Card className="border-2 border-brand-sage/20 bg-brand-sage/5 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-sage/10 rounded-2xl text-brand-sage shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Actualizar Logo o Foto de Perfil</h3>
                      <p className="text-sm text-gray-500 mt-1">Pega la URL de tu logo corporativo o foto de perfil.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          type="url"
                          placeholder="https://tu-sitio.com/logo.jpg"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateAvatar}
                        disabled={isUpdatingAvatar || !avatarUrl.trim()}
                        className="h-12 px-6 rounded-xl bg-brand-sage hover:bg-brand-olive font-bold shadow-md"
                      >
                        {isUpdatingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Guardar</>}
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowAvatarInput(false); setAvatarUrl(""); }} className="h-12 w-12 rounded-xl p-0 text-gray-400">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    {avatarUrl && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                        <span className="text-xs font-bold text-gray-400 uppercase">Preview:</span>
                        <Avatar className="w-10 h-10 rounded-lg border border-gray-200 bg-brand-bg">
                          <AvatarImage src={avatarUrl} alt="Preview" className="object-cover" />
                          <AvatarFallback className="bg-brand-bg text-gray-400 text-xs rounded-lg">?</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-400 truncate max-w-xs">{avatarUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* DATOS DE LA EMPRESA */}
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="bg-brand-bg/50 border-b border-gray-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <Building2 className="w-5 h-5 text-brand-sage" /> Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   Nombre de la Empresa
                </label>
                <Input 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  className="bg-gray-50 border-gray-200" 
                  placeholder="Ej. Maxier Studio"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" /> Sitio Web
                </label>
                <Input 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange} 
                  className="bg-gray-50 border-gray-200" 
                  placeholder="https://www.tu-empresa.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Ubicación (Sede)
                </label>
                <Input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className="bg-gray-50 border-gray-200" 
                  placeholder="Ciudad, País"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" /> Industria
                  </label>
                  <Input 
                    name="industry" 
                    value={formData.industry} 
                    onChange={handleChange} 
                    className="bg-gray-50 border-gray-200" 
                    placeholder="Tecnología, Salud..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" /> Tamaño
                  </label>
                  <Input 
                    name="size" 
                    value={formData.size} 
                    onChange={handleChange} 
                    className="bg-gray-50 border-gray-200" 
                    placeholder="1-50 empleados"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Descripción de la Empresa
                </label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="min-h-[120px] bg-gray-50 border-gray-200" 
                  placeholder="Describe qué hace tu empresa, su cultura y por qué un perfil Senior debería unirse..."
                />
              </div>
            </CardContent>
          </Card>

          {/* DATOS DEL RESPONSABLE */}
          <Card className="shadow-sm border-gray-100 h-fit">
            <CardHeader className="bg-brand-bg/50 border-b border-gray-100">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                <User className="w-5 h-5 text-brand-sage" /> Responsable de la Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nombre</label>
                  <Input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="bg-gray-50 border-gray-200" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Apellido</label>
                  <Input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="bg-gray-50 border-gray-200" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> Correo Corporativo
                </label>
                <Input 
                  name="email" 
                  value={formData.email} 
                  disabled
                  className="bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500" 
                />
                <p className="text-xs text-gray-500">El correo principal no se puede cambiar aquí.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Teléfono de Contacto
                </label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="bg-gray-50 border-gray-200" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-brand-sage hover:bg-brand-olive rounded-xl h-14 px-10 font-bold text-lg shadow-xl shadow-brand-sage/20 transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}

