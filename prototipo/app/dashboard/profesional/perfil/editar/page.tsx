"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  Link2,
  Plus,
  Trash2,
  ArrowLeft,
  User,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

interface WorkExperience {
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface Language {
  language: string;
  level: string;
}

interface ProfileData {
  headline: string;
  summary: string;
  title: string;
  bio: string;
  experienceYears: number | null;
  linkedinUrl: string;
  portfolioUrl: string;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  availabilityStatus: string;
  salaryExpectation: string;
  modalityPreference: string;
}

const sections = [
  { id: "personal", label: "Información Personal", icon: User },
  { id: "experience", label: "Experiencia Laboral", icon: Briefcase },
  { id: "education", label: "Formación", icon: GraduationCap },
  { id: "certifications", label: "Certificaciones", icon: Award },
  { id: "languages", label: "Idiomas", icon: Globe },
  { id: "preferences", label: "Preferencias Laborales", icon: MapPin },
];

export default function EditarPerfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["personal"]));

  const [form, setForm] = useState<ProfileData>({
    headline: "",
    summary: "",
    title: "",
    bio: "",
    experienceYears: null,
    linkedinUrl: "",
    portfolioUrl: "",
    workExperience: [],
    education: [],
    certifications: [],
    languages: [],
    availabilityStatus: "disponible",
    salaryExpectation: "",
    modalityPreference: "",
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/professional/profile");
        if (res.ok && !cancelled) {
          const data = await res.json();
          setForm({
            headline: data.headline || "",
            summary: data.summary || "",
            title: data.title || "",
            bio: data.bio || "",
            experienceYears: data.experienceYears || null,
            linkedinUrl: data.linkedinUrl || "",
            portfolioUrl: data.portfolioUrl || "",
            workExperience: data.workExperience || [],
            education: data.education || [],
            certifications: data.certifications || [],
            languages: data.languages || [],
            availabilityStatus: data.availabilityStatus || "disponible",
            salaryExpectation: data.salaryExpectation || "",
            modalityPreference: data.modalityPreference || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/professional/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("¡Perfil actualizado con éxito!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al guardar");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  // Array helpers
  const addWorkExperience = () => {
    setForm((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, { company: "", role: "", startYear: "", endYear: "", description: "" }],
    }));
  };

  const removeWorkExperience = (index: number) => {
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", field: "", year: "" }],
    }));
  };

  const removeEducation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addCertification = () => {
    setForm((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", issuer: "", year: "" }],
    }));
  };

  const removeCertification = (index: number) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addLanguage = () => {
    setForm((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "", level: "Intermedio" }],
    }));
  };

  const removeLanguage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#2C2C2C] animate-spin" />
          <p className="text-sm text-[#6B6B6B] font-medium animate-pulse">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-0 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/profesional/perfil"
            className="w-10 h-10 rounded-2xl bg-[#EDE8DB] flex items-center justify-center hover:bg-[#DDD5C5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight">Editar Perfil</h1>
            <p className="text-sm text-[#9B9B9B]">Construye tu CV Vivo para destacar ante las empresas</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl font-bold px-6 bg-[#7B9E6B] hover:bg-[#6B8E5B] text-white shadow-md"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar
        </Button>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const SectionIcon = section.icon;
        const isExpanded = expandedSections.has(section.id);

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#EDE8DB] shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-4 p-5 hover:bg-[#F5F0E8]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#7B9E6B]/10 flex items-center justify-center shrink-0">
                <SectionIcon className="w-5 h-5 text-[#7B9E6B]" />
              </div>
              <span className="flex-1 text-left font-bold text-[#1A1A1A]">{section.label}</span>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-[#9B9B9B]" /> : <ChevronDown className="w-5 h-5 text-[#9B9B9B]" />}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 space-y-4">
                    {/* PERSONAL */}
                    {section.id === "personal" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#9B9B9B] uppercase">Título Profesional</label>
                          <Input
                            value={form.headline}
                            onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                            placeholder="Ej: Director de RRHH con 20 años de experiencia"
                            className="rounded-xl border-[#EDE8DB] h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#9B9B9B] uppercase">Propuesta de Valor</label>
                          <textarea
                            value={form.summary}
                            onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                            placeholder="¿Qué te hace único? ¿Cuál es tu valor diferencial?"
                            rows={3}
                            className="w-full rounded-xl border border-[#EDE8DB] p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7B9E6B]/30 focus:border-[#7B9E6B]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9B9B9B] uppercase">Años de Experiencia</label>
                            <Input
                              type="number"
                              value={form.experienceYears ?? ""}
                              onChange={(e) => setForm((p) => ({ ...p, experienceYears: e.target.value ? parseInt(e.target.value) : null }))}
                              placeholder="20"
                              className="rounded-xl border-[#EDE8DB] h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9B9B9B] uppercase">Biografía Breve</label>
                            <Input
                              value={form.bio}
                              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                              placeholder="Resumen breve sobre ti"
                              className="rounded-xl border-[#EDE8DB] h-11"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9B9B9B] uppercase flex items-center gap-1.5">
                              <Link2 className="w-3.5 h-3.5" /> LinkedIn
                            </label>
                            <Input
                              value={form.linkedinUrl}
                              onChange={(e) => setForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
                              placeholder="https://linkedin.com/in/tu-perfil"
                              className="rounded-xl border-[#EDE8DB] h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#9B9B9B] uppercase flex items-center gap-1.5">
                              <Link2 className="w-3.5 h-3.5" /> Portfolio / Web
                            </label>
                            <Input
                              value={form.portfolioUrl}
                              onChange={(e) => setForm((p) => ({ ...p, portfolioUrl: e.target.value }))}
                              placeholder="https://tu-portfolio.com"
                              className="rounded-xl border-[#EDE8DB] h-11"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* WORK EXPERIENCE */}
                    {section.id === "experience" && (
                      <>
                        {form.workExperience.map((exp, i) => (
                          <div key={i} className="p-4 rounded-2xl border border-[#EDE8DB] bg-[#F5F0E8]/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-[#7B9E6B]/10 text-[#7B9E6B] border-0 text-xs font-bold">Experiencia {i + 1}</Badge>
                              <button onClick={() => removeWorkExperience(i)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input value={exp.company} onChange={(e) => updateWorkExperience(i, "company", e.target.value)} placeholder="Empresa" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                              <Input value={exp.role} onChange={(e) => updateWorkExperience(i, "role", e.target.value)} placeholder="Cargo" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input value={exp.startYear} onChange={(e) => updateWorkExperience(i, "startYear", e.target.value)} placeholder="Año inicio (ej: 2010)" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                              <Input value={exp.endYear} onChange={(e) => updateWorkExperience(i, "endYear", e.target.value)} placeholder="Año fin (o 'Presente')" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                            </div>
                            <textarea
                              value={exp.description}
                              onChange={(e) => updateWorkExperience(i, "description", e.target.value)}
                              placeholder="Descripción del rol y logros principales"
                              rows={2}
                              className="w-full rounded-xl border border-[#EDE8DB] p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7B9E6B]/30"
                            />
                          </div>
                        ))}
                        <Button onClick={addWorkExperience} variant="outline" className="w-full rounded-2xl border-dashed border-[#EDE8DB] text-[#9B9B9B] hover:text-[#7B9E6B] hover:border-[#7B9E6B] h-12">
                          <Plus className="w-4 h-4 mr-2" /> Agregar Experiencia
                        </Button>
                      </>
                    )}

                    {/* EDUCATION */}
                    {section.id === "education" && (
                      <>
                        {form.education.map((edu, i) => (
                          <div key={i} className="p-4 rounded-2xl border border-[#EDE8DB] bg-[#F5F0E8]/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-[#D4C36A]/10 text-[#D4C36A] border-0 text-xs font-bold">Formación {i + 1}</Badge>
                              <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="Institución" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                              <Input value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} placeholder="Título" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} placeholder="Campo de estudio" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                              <Input value={edu.year} onChange={(e) => updateEducation(i, "year", e.target.value)} placeholder="Año" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                            </div>
                          </div>
                        ))}
                        <Button onClick={addEducation} variant="outline" className="w-full rounded-2xl border-dashed border-[#EDE8DB] text-[#9B9B9B] hover:text-[#D4C36A] hover:border-[#D4C36A] h-12">
                          <Plus className="w-4 h-4 mr-2" /> Agregar Formación
                        </Button>
                      </>
                    )}

                    {/* CERTIFICATIONS */}
                    {section.id === "certifications" && (
                      <>
                        {form.certifications.map((cert, i) => (
                          <div key={i} className="p-4 rounded-2xl border border-[#EDE8DB] bg-[#F5F0E8]/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className="bg-[#D4826A]/10 text-[#D4826A] border-0 text-xs font-bold">Certificación {i + 1}</Badge>
                              <button onClick={() => removeCertification(i)} className="text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <Input value={cert.name} onChange={(e) => updateCertification(i, "name", e.target.value)} placeholder="Nombre" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                              <Input value={cert.issuer} onChange={(e) => updateCertification(i, "issuer", e.target.value)} placeholder="Institución" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                              <Input value={cert.year} onChange={(e) => updateCertification(i, "year", e.target.value)} placeholder="Año" className="rounded-xl border-[#EDE8DB] h-10 text-sm" />
                            </div>
                          </div>
                        ))}
                        <Button onClick={addCertification} variant="outline" className="w-full rounded-2xl border-dashed border-[#EDE8DB] text-[#9B9B9B] hover:text-[#D4826A] hover:border-[#D4826A] h-12">
                          <Plus className="w-4 h-4 mr-2" /> Agregar Certificación
                        </Button>
                      </>
                    )}

                    {/* LANGUAGES */}
                    {section.id === "languages" && (
                      <>
                        {form.languages.map((lang, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Input value={lang.language} onChange={(e) => updateLanguage(i, "language", e.target.value)} placeholder="Idioma" className="rounded-xl border-[#EDE8DB] h-10 text-sm flex-1" />
                            <select
                              value={lang.level}
                              onChange={(e) => updateLanguage(i, "level", e.target.value)}
                              className="h-10 rounded-xl border border-[#EDE8DB] px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7B9E6B]/30"
                            >
                              <option value="Básico">Básico</option>
                              <option value="Intermedio">Intermedio</option>
                              <option value="Avanzado">Avanzado</option>
                              <option value="Nativo">Nativo</option>
                            </select>
                            <button onClick={() => removeLanguage(i)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <Button onClick={addLanguage} variant="outline" className="w-full rounded-2xl border-dashed border-[#EDE8DB] text-[#9B9B9B] hover:text-[#7B9E6B] hover:border-[#7B9E6B] h-12">
                          <Plus className="w-4 h-4 mr-2" /> Agregar Idioma
                        </Button>
                      </>
                    )}

                    {/* PREFERENCES */}
                    {section.id === "preferences" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#9B9B9B] uppercase">Disponibilidad</label>
                          <div className="flex gap-3">
                            {[
                              { value: "disponible", label: "Disponible", color: "#7B9E6B" },
                              { value: "en_proceso", label: "En proceso", color: "#D4C36A" },
                              { value: "no_disponible", label: "No disponible", color: "#D4826A" },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setForm((p) => ({ ...p, availabilityStatus: opt.value }))}
                                className={`flex-1 h-11 rounded-xl border-2 text-sm font-bold transition-all ${
                                  form.availabilityStatus === opt.value
                                    ? "border-current bg-current/10"
                                    : "border-[#EDE8DB] text-[#9B9B9B] hover:border-[#D4C9A8]"
                                }`}
                                style={form.availabilityStatus === opt.value ? { color: opt.color } : undefined}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#9B9B9B] uppercase">Modalidad Preferida</label>
                          <div className="flex gap-3">
                            {["remoto", "presencial", "hibrido"].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setForm((p) => ({ ...p, modalityPreference: opt }))}
                                className={`flex-1 h-11 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                                  form.modalityPreference === opt
                                    ? "border-[#7B9E6B] text-[#7B9E6B] bg-[#7B9E6B]/10"
                                    : "border-[#EDE8DB] text-[#9B9B9B] hover:border-[#D4C9A8]"
                                }`}
                              >
                                {opt === "hibrido" ? "Híbrido" : opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#9B9B9B] uppercase">Expectativa Salarial</label>
                          <Input
                            value={form.salaryExpectation}
                            onChange={(e) => setForm((p) => ({ ...p, salaryExpectation: e.target.value }))}
                            placeholder="Ej: $800.000 - $1.200.000 ARS"
                            className="rounded-xl border-[#EDE8DB] h-11"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Bottom Save */}
      <div className="sticky bottom-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-2xl font-bold px-8 py-6 bg-[#7B9E6B] hover:bg-[#6B8E5B] text-white shadow-xl text-base"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
