"use client";

import { useState, useEffect, use } from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Link2,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Star,
  BookOpen,
  Monitor,
  Heart,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface PublicProfile {
  user: {
    name: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    location: string | null;
    createdAt: string;
  };
  profile: {
    headline: string | null;
    summary: string | null;
    title: string | null;
    bio: string | null;
    experienceYears: number | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
    workExperience: { company: string; role: string; startYear: string; endYear: string; description: string }[];
    education: { institution: string; degree: string; field: string; year: string }[];
    certifications: { name: string; issuer: string; year: string }[];
    languages: { language: string; level: string }[];
    availabilityStatus: string | null;
    modalityPreference: string | null;
    progress: number | null;
  };
  skills: { skillName: string; category: string; level: string; isValidated: boolean }[];
  employabilityScore: number;
  learningStats: { completed: number; total: number };
}

const availabilityColors: Record<string, { bg: string; text: string; label: string }> = {
  disponible: { bg: "bg-[#7B9E6B]/10", text: "text-[#7B9E6B]", label: "Disponible" },
  en_proceso: { bg: "bg-[#D4C36A]/10", text: "text-[#D4C36A]", label: "En Proceso" },
  no_disponible: { bg: "bg-[#D4826A]/10", text: "text-[#D4826A]", label: "No Disponible" },
};

const skillCategoryIcons: Record<string, { icon: typeof Monitor; color: string }> = {
  DIGITAL: { icon: Monitor, color: "#7B9E6B" },
  SOCIOEMOCIONAL: { icon: Heart, color: "#D4826A" },
  COGNITIVO: { icon: Brain, color: "#D4C36A" },
};

export default function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [data, setData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/professional/public/${userId}`);
        if (res.ok && !cancelled) {
          setData(await res.json());
        }
      } catch (err) {
        console.error("Error loading public profile:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#2C2C2C] animate-spin" />
          <p className="text-sm text-[#6B6B6B] font-medium animate-pulse">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-[#1A1A1A]">Perfil no encontrado</h1>
          <Link href="/" className="text-[#7B9E6B] font-bold hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const { user, profile, skills, employabilityScore, learningStats } = data;
  const availability = availabilityColors[profile.availabilityStatus || "disponible"];

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#EDE8DB] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#9B9B9B] hover:text-[#1A1A1A] transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Red de Bienestar Laboral
          </Link>
          <Badge className="bg-[#7B9E6B]/10 text-[#7B9E6B] border-0 font-bold">CV Vivo</Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#EDE8DB] shadow-sm overflow-hidden"
        >
          <div className="relative h-32 bg-gradient-to-r from-[#7B9E6B] via-[#8B9A6B] to-[#D4C36A]" />
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={user.name} width={112} height={112} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-[#7B9E6B] flex items-center justify-center text-white text-4xl font-black">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2 pt-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight">{user.name}</h1>
                  <Badge className={`${availability.bg} ${availability.text} border-0 font-bold text-xs`}>
                    {availability.label}
                  </Badge>
                </div>
                {profile.headline && (
                  <p className="text-lg text-[#6B6B6B] font-semibold">{profile.headline}</p>
                )}
                <div className="flex items-center gap-4 flex-wrap text-sm text-[#9B9B9B]">
                  {user.location && (
                    <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-3.5 h-3.5" /> {user.location}</span>
                  )}
                  {profile.experienceYears && (
                    <span className="flex items-center gap-1.5 font-medium"><Briefcase className="w-3.5 h-3.5" /> {profile.experienceYears} años de experiencia</span>
                  )}
                  {profile.modalityPreference && (
                    <Badge variant="outline" className="text-xs font-bold border-[#EDE8DB] capitalize">{profile.modalityPreference === "hibrido" ? "Híbrido" : profile.modalityPreference}</Badge>
                  )}
                </div>
                {/* Links */}
                <div className="flex items-center gap-3 pt-1">
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#0A66C2] font-bold text-sm hover:underline">
                      <Link2 className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {profile.portfolioUrl && (
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#7B9E6B] font-bold text-sm hover:underline">
                      <Link2 className="w-4 h-4" /> Portfolio
                    </a>
                  )}
                </div>
              </div>

              {/* Employability Score */}
              <div className="shrink-0 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7B9E6B] to-[#D4C36A] flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-white">{employabilityScore}</span>
                </div>
                <p className="text-[9px] font-bold text-[#9B9B9B] uppercase mt-2 tracking-wider">Score</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Summary */}
            {profile.summary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
                <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-3">Propuesta de Valor</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{profile.summary}</p>
              </motion.div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
                <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-3">Habilidades</h3>
                <div className="space-y-2">
                  {skills.map((skill) => {
                    const catConfig = skillCategoryIcons[skill.category] || { icon: Star, color: "#9B9B9B" };
                    const CatIcon = catConfig.icon;
                    return (
                      <div key={skill.skillName} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F0E8]/50 transition-colors">
                        <CatIcon className="w-4 h-4 shrink-0" style={{ color: catConfig.color }} />
                        <span className="text-sm font-semibold text-[#1A1A1A] flex-1">{skill.skillName}</span>
                        <Badge variant="outline" className="text-[10px] font-bold border-[#EDE8DB] text-[#9B9B9B]">{skill.level}</Badge>
                        {skill.isValidated && <CheckCircle2 className="w-4 h-4 text-[#7B9E6B] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Languages */}
            {profile.languages.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
                <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Idiomas</h3>
                <div className="space-y-2">
                  {profile.languages.map((lang, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1A1A1A]">{lang.language}</span>
                      <Badge variant="outline" className="text-[10px] font-bold border-[#EDE8DB] text-[#9B9B9B]">{lang.level}</Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Learning Progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
              <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Progreso de Aprendizaje</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2.5 bg-[#EDE8DB] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7B9E6B] to-[#D4C36A]" style={{ width: `${learningStats.total > 0 ? (learningStats.completed / learningStats.total) * 100 : 0}%` }} />
                  </div>
                </div>
                <span className="text-sm font-black text-[#1A1A1A]">{learningStats.completed}/{learningStats.total}</span>
              </div>
              <p className="text-[10px] text-[#9B9B9B] font-bold uppercase mt-2">Módulos completados en la plataforma</p>
            </motion.div>
          </div>

          {/* Right Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Experience */}
            {profile.workExperience.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
                <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-5 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Experiencia Laboral</h3>
                <div className="space-y-5">
                  {profile.workExperience.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-[#EDE8DB] hover:border-[#7B9E6B] transition-colors">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[#7B9E6B]" />
                      <h4 className="font-bold text-[#1A1A1A]">{exp.role}</h4>
                      <p className="text-sm font-semibold text-[#7B9E6B]">{exp.company}</p>
                      <p className="text-xs text-[#9B9B9B] font-bold flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> {exp.startYear} — {exp.endYear || "Presente"}</p>
                      {exp.description && <p className="text-sm text-[#6B6B6B] mt-2 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education */}
            {profile.education.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
                <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-5 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Formación</h3>
                <div className="space-y-4">
                  {profile.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#D4C36A]/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#D4C36A]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A1A]">{edu.degree}</h4>
                        <p className="text-sm text-[#6B6B6B] font-medium">{edu.institution}</p>
                        <p className="text-xs text-[#9B9B9B]">{edu.field} · {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
                <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-4 flex items-center gap-2"><Award className="w-4 h-4" /> Certificaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F0E8]/50 border border-[#EDE8DB]">
                      <div className="w-8 h-8 rounded-xl bg-[#D4826A]/10 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-[#D4826A]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{cert.name}</h4>
                        <p className="text-[10px] text-[#9B9B9B] font-medium">{cert.issuer} · {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Employability Score Breakdown */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-white to-[#F5F0E8]/50 rounded-3xl p-6 border border-[#EDE8DB] shadow-sm">
              <h3 className="text-xs font-black text-[#9B9B9B] uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Score de Empleabilidad</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7B9E6B] to-[#D4C36A] flex items-center justify-center shadow-xl shrink-0">
                  <span className="text-4xl font-black text-white">{employabilityScore}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#EDE8DB] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${employabilityScore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#7B9E6B] via-[#8B9A6B] to-[#D4C36A]"
                    />
                  </div>
                  <p className="text-xs text-[#9B9B9B] font-medium">
                    {employabilityScore >= 80 ? "Perfil muy atractivo para empresas" :
                     employabilityScore >= 50 ? "Buen perfil, sigue mejorando" :
                     "Completa tu perfil para mejorar tu score"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer badge */}
        <div className="text-center pt-4">
          <p className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-widest">
            Perfil verificado por Red de Bienestar Laboral · Miembro desde {new Date(user.createdAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
