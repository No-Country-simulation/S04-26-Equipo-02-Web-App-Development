"use client";

import { useState, useEffect } from "react";
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
  X,
  Pencil,
  Globe,
  TrendingUp,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

interface ProfileData {
  headline: string | null;
  summary: string | null;
  title: string | null;
  bio: string | null;
  experienceYears: number | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  workExperience: { company: string; role: string; startYear: string; endYear: string }[];
  education: { institution: string; degree: string; field: string; year: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  languages: { language: string; level: string }[];
  availabilityStatus: string | null;
  modalityPreference: string | null;
  progress: number | null;
  skills: { skillName: string; category: string; level: string; isValidated: boolean }[];
  employabilityScore: number;
  learningStats: { completed: number; total: number };
  stats: { webinars: number; workshops: number; networking: number };
}

export default function PerfilPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const res = await fetch("/api/professional/profile");
        if (res.ok && !cancelled) {
          setProfile(await res.json());
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    if (user) loadProfile();
    return () => { cancelled = true; };
  }, [user]);

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
          <Loader2 className="w-8 h-8 animate-spin text-[#7B9E6B]" />
          <p className="text-[#9B9B9B] font-medium">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  const role = user.role || "PROFESSIONAL";
  const isProfessional = role === "PROFESSIONAL";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* Header Perfil */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-6 border-b border-[#EDE8DB]">
        <div className="relative group">
          <Avatar className="w-32 h-36 rounded-3xl shadow-xl border-4 border-white">
            {user.image && (
              <AvatarImage 
                src={user.image} 
                alt={user.name} 
                className="object-cover rounded-3xl" 
              />
            )}
            <AvatarFallback className="bg-[#7B9E6B] text-white text-4xl font-black rounded-3xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <button
            onClick={() => setShowAvatarInput(!showAvatarInput)}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-3xl flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>

          <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-xl shadow-lg border border-[#EDE8DB]">
            {isProfessional ? <UserCircle2 className="w-5 h-5 text-[#7B9E6B]" /> : <Building2 className="w-5 h-5 text-[#7B9E6B]" />}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight">{user.firstName} </h1>
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight">{user.lastName}</h1>
            {profile?.availabilityStatus && (
              <Badge className={`border-0 font-bold text-xs ${
                profile.availabilityStatus === "disponible" ? "bg-[#7B9E6B]/10 text-[#7B9E6B]" :
                profile.availabilityStatus === "en_proceso" ? "bg-[#D4C36A]/10 text-[#D4C36A]" :
                "bg-[#D4826A]/10 text-[#D4826A]"
              }`}>
                {profile.availabilityStatus === "disponible" ? "Disponible" :
                 profile.availabilityStatus === "en_proceso" ? "En proceso" : "No disponible"}
              </Badge>
            )}
          </div>
          {profile?.headline && <p className="text-lg text-[#6B6B6B] font-semibold">{profile.headline}</p>}
          <p className="text-[#9B9B9B] font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/profesional/perfil/editar">
            <Button className="rounded-2xl font-bold bg-[#7B9E6B] hover:bg-[#6B8E5B] text-white">
              <Pencil className="w-4 h-4 mr-2" /> Editar Perfil
            </Button>
          </Link>
          {user.id && (
            <Link href={`/perfil/${user.id}`} target="_blank">
              <Button variant="outline" className="rounded-2xl font-bold border-[#EDE8DB] text-[#6B6B6B]">
                <ExternalLink className="w-4 h-4 mr-2" /> Ver CV Público
              </Button>
            </Link>
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
            <Card className="border-2 border-[#7B9E6B]/20 bg-[#7B9E6B]/5 rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#7B9E6B]/10 rounded-2xl text-[#7B9E6B] shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-lg">Actualizar tu Foto de Perfil</h3>
                      <p className="text-sm text-[#6B6B6B] mt-1">Pega la URL de tu foto (desde LinkedIn, Google, o cualquier servicio de imágenes).</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
                        <Input 
                          type="url"
                          placeholder="https://tu-foto.com/avatar.jpg"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="pl-11 h-12 rounded-xl border-[#EDE8DB]"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateAvatar}
                        disabled={isUpdating || !avatarUrl.trim()}
                        className="h-12 px-6 rounded-xl bg-[#7B9E6B] hover:bg-[#6B8E5B] font-bold shadow-md"
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Guardar</>}
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowAvatarInput(false); setAvatarUrl(""); }} className="h-12 w-12 rounded-xl p-0 text-[#9B9B9B]">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    {avatarUrl && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#EDE8DB]">
                        <span className="text-xs font-bold text-[#9B9B9B] uppercase">Preview:</span>
                        <Avatar className="w-10 h-10 rounded-lg border border-[#EDE8DB]">
                          <AvatarImage src={avatarUrl} alt="Preview" className="object-cover" />
                          <AvatarFallback className="bg-[#EDE8DB] text-[#9B9B9B] text-xs rounded-lg">?</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-[#9B9B9B] truncate max-w-xs">{avatarUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Score Empleabilidad", value: `${profile.employabilityScore}`, icon: TrendingUp, color: "#7B9E6B" },
            { label: "Módulos Completados", value: `${profile.learningStats.completed}/${profile.learningStats.total}`, icon: GraduationCap, color: "#D4C36A" },
            { label: "Experiencia", value: profile.experienceYears ? `${profile.experienceYears} años` : "—", icon: Briefcase, color: "#D4826A" },
            { label: "Nivel Perfil", value: `${profile.progress || 10}%`, icon: CheckCircle2, color: "#7B9E6B" },
          ].map((stat, i) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white rounded-3xl p-5 border border-[#EDE8DB] shadow-sm"
              >
                <StatIcon className="w-5 h-5 mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-black text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="bg-white rounded-3xl p-6 space-y-6 border border-[#EDE8DB] shadow-sm">
            <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F0E8] rounded-xl"><MapPin className="w-4 h-4 text-[#9B9B9B]" /></div>
                <div>
                  <p className="text-[10px] font-bold text-[#9B9B9B] uppercase">Ubicación</p>
                  <p className="text-sm font-bold text-[#1A1A1A]">{user.location || "No especificada"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5F0E8] rounded-xl"><Phone className="w-4 h-4 text-[#9B9B9B]" /></div>
                <div>
                  <p className="text-[10px] font-bold text-[#9B9B9B] uppercase">Teléfono</p>
                  <p className="text-sm font-bold text-[#1A1A1A]">{user.phone || "No especificado"}</p>
                </div>
              </div>
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="p-2 bg-[#0A66C2]/10 rounded-xl"><Link2 className="w-4 h-4 text-[#0A66C2]" /></div>
                  <p className="text-sm font-bold text-[#0A66C2] group-hover:underline">LinkedIn</p>
                </a>
              )}
              {profile?.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="p-2 bg-[#7B9E6B]/10 rounded-xl"><Globe className="w-4 h-4 text-[#7B9E6B]" /></div>
                  <p className="text-sm font-bold text-[#7B9E6B] group-hover:underline">Portfolio</p>
                </a>
              )}
            </div>
          </Card>

          <Card className="bg-[#7B9E6B]/5 p-6 rounded-3xl border border-[#7B9E6B]/10">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#7B9E6B] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#7B9E6B] uppercase mb-1">Estado de Cuenta</p>
                <p className="text-sm text-[#7B9E6B]/70 leading-relaxed font-medium">
                  Tu perfil ha sido validado correctamente por el equipo de administración de la Red.
                </p>
              </div>
            </div>
          </Card>

          {/* Languages */}
          {profile && profile.languages.length > 0 && (
            <Card className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
              <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-3">Idiomas</h3>
              <div className="space-y-2">
                {profile.languages.map((lang, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1A1A]">{lang.language}</span>
                    <Badge variant="outline" className="text-[10px] font-bold border-[#EDE8DB] text-[#9B9B9B]">{lang.level}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          {profile?.summary && (
            <Card className="bg-white overflow-hidden rounded-3xl border border-[#EDE8DB] shadow-sm">
              <CardHeader className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB] p-6">
                <CardTitle className="text-sm font-black text-[#9B9B9B] uppercase tracking-widest">Propuesta de Valor</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{profile.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {profile && profile.workExperience.length > 0 && (
            <Card className="bg-white overflow-hidden rounded-3xl border border-[#EDE8DB] shadow-sm">
              <CardHeader className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB] p-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#7B9E6B]" />
                  <CardTitle className="text-sm font-black text-[#9B9B9B] uppercase tracking-widest">Experiencia Laboral</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {profile.workExperience.map((exp, i) => (
                  <div key={i} className="pl-4 border-l-2 border-[#EDE8DB]">
                    <h4 className="font-bold text-[#1A1A1A]">{exp.role}</h4>
                    <p className="text-sm font-semibold text-[#7B9E6B]">{exp.company}</p>
                    <p className="text-xs text-[#9B9B9B] flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> {exp.startYear} — {exp.endYear || "Presente"}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          <Card className="bg-white overflow-hidden rounded-3xl border border-[#EDE8DB] shadow-sm">
            <CardHeader className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB] p-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#7B9E6B]" />
                <CardTitle className="text-sm font-black text-[#9B9B9B] uppercase tracking-widest">Habilidades</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {profile && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge 
                      key={skill.skillName} 
                      className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        skill.isValidated ? "bg-[#7B9E6B]/10 text-[#7B9E6B] border-[#7B9E6B]/20" : "bg-[#F5F0E8] text-[#6B6B6B] border-[#EDE8DB]"
                      }`}
                    >
                      {skill.skillName}
                      {skill.isValidated && <CheckCircle2 className="w-3 h-3 ml-1.5" />}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9B9B9B]">Completa tu perfil para agregar habilidades</p>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          {profile && profile.certifications.length > 0 && (
            <Card className="bg-white overflow-hidden rounded-3xl border border-[#EDE8DB] shadow-sm">
              <CardHeader className="bg-[#F5F0E8]/50 border-b border-[#EDE8DB] p-6">
                <CardTitle className="text-sm font-black text-[#9B9B9B] uppercase tracking-widest flex items-center gap-2"><Award className="w-4 h-4" /> Certificaciones</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F0E8]/50">
                    <div className="w-8 h-8 rounded-xl bg-[#D4826A]/10 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-[#D4826A]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{cert.name}</p>
                      <p className="text-[10px] text-[#9B9B9B]">{cert.issuer} · {cert.year}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
