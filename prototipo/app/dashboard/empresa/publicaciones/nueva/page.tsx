"use client";

import { useState } from "react";
import { FileText, ArrowLeft, Loader2, Target, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function NuevaVacantePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    modality: "Híbrido",
    location: "",
    salaryRange: "",
    experienceRequired: "Más de 10 años",
    skillsRequired: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert skills to JSON array
      const skillsArray = formData.skillsRequired.split(",").map(s => s.trim()).filter(s => s.length > 0);

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skillsRequired: skillsArray
        }),
      });

      if (res.ok) {
        toast.success("Vacante publicada exitosamente 🎉");
        router.push("/dashboard/empresa/publicaciones");
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al publicar la vacante");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/empresa/publicaciones" className="text-gray-500 hover:text-brand-sage flex items-center gap-2 w-fit mb-4 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a publicaciones
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Target className="w-8 h-8 text-brand-sage" /> Publicar Nueva Vacante
        </h1>
        <p className="text-gray-500 text-lg">Define claramente el rol para atraer al mejor talento Senior (+45).</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
              <FileText className="w-5 h-5 text-brand-sage" /> Información Principal
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Título de la Vacante *</label>
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Ej. Director de Operaciones (COO)" 
                className="h-14 bg-gray-50 border-gray-200 focus-visible:ring-brand-sage text-lg" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Descripción del Rol *</label>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Describe los desafíos y responsabilidades..." 
                className="min-h-[150px] bg-gray-50 border-gray-200 focus-visible:ring-brand-sage text-base" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Requisitos Adicionales</label>
              <Textarea 
                name="requirements" 
                value={formData.requirements} 
                onChange={handleChange} 
                placeholder="Ej. Disponibilidad para viajar..." 
                className="min-h-[100px] bg-gray-50 border-gray-200 focus-visible:ring-brand-sage text-base" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Habilidades Clave (separadas por coma)</label>
              <Input 
                name="skillsRequired" 
                value={formData.skillsRequired} 
                onChange={handleChange} 
                placeholder="Liderazgo, Gestión de Equipos, Estrategia..." 
                className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-brand-sage" 
              />
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
              <CheckCircle2 className="w-5 h-5 text-brand-sage" /> Detalles Contractuales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Modalidad</label>
                <select 
                  name="modality" 
                  value={formData.modality} 
                  onChange={handleChange} 
                  className="flex h-12 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Remoto">Remoto</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Ubicación</label>
                <Input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="Ciudad, País" 
                  className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-brand-sage" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Experiencia Mínima</label>
                <select 
                  name="experienceRequired" 
                  value={formData.experienceRequired} 
                  onChange={handleChange} 
                  className="flex h-12 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Más de 5 años">Más de 5 años</option>
                  <option value="Más de 10 años">Más de 10 años</option>
                  <option value="Más de 15 años">Más de 15 años</option>
                  <option value="Más de 20 años">Más de 20 años</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Rango Salarial (Opcional)</label>
                <Input 
                  name="salaryRange" 
                  value={formData.salaryRange} 
                  onChange={handleChange} 
                  placeholder="Ej. USD 5,000 - 7,000 / mes" 
                  className="h-12 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-brand-sage hover:bg-brand-olive rounded-xl h-14 px-10 font-bold text-lg shadow-xl shadow-brand-sage/20 transition-all flex items-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Publicando..." : "Publicar Vacante"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
