"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Sparkles,
  Rocket
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    area: "",
    industry: "",
    isWorking: "",
    selectedSkills: [] as string[],
  });

  const skillCategories = [
    {
      name: "Digitales",
      skills: ["Slack / Teams", "LinkedIn Optimizado", "IA Generativa", "Gestión de Proyectos (Trello/Asana)", "Herramientas de Diseño (Canva/Figma)", "Google Workspace / Office 365"]
    },
    {
      name: "Socioemocionales",
      skills: ["Liderazgo de Equipos", "Gestión de la Frustración", "Comunicación Empática", "Adaptabilidad al Cambio", "Resolución de Conflictos", "Mentoreo / Coaching"]
    },
    {
      name: "Cognitivas",
      skills: ["Pensamiento Crítico", "Resolución de Problemas Complejos", "Toma de Decisiones", "Aprendizaje Continuo (Learnability)", "Análisis de Datos", "Visión Estratégica"]
    }
  ];

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("¡Diagnóstico completado con éxito!");
      } else {
        toast.error("Hubo un error al guardar tus datos.");
      }
    } catch {
      toast.error("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFCF5] flex items-center justify-center p-4 overflow-hidden relative">
        {/* Decorative elements - Buildbox style */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/10 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center z-10"
        >
          <div className="mb-8 flex justify-center">
             <div className="w-24 h-24 bg-[#003366] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/20">
                <CheckCircle2 className="w-12 h-12 text-white" />
             </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">¡Todo listo, {session?.user?.name?.split(" ")[0]}!</h1>
          <p className="text-gray-500 mb-10 text-lg leading-relaxed">
            Hemos analizado tus habilidades y ya generamos tu <strong>Ruta de Aprendizaje</strong> personalizada.
          </p>
          <Button 
            size="lg" 
            onClick={async () => {
              await authClient.getSession({ query: { disableCookieCache: true } });
              router.push("/dashboard/profesional");
            }}
            className="w-full bg-[#003366] text-white hover:bg-blue-900 py-7 text-xl font-bold rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
          >
            Comenzar mi Ruta <Rocket className="ml-2 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF5] flex flex-col md:flex-row font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* Sidebar Info - Buildbox Aesthetic */}
      <div className="hidden md:flex md:w-[400px] bg-[#003366] p-12 flex-col justify-between relative overflow-hidden shrink-0">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
              <Image src="/logo-espera.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-white font-black text-xl tracking-tight uppercase">Bienestar Laboral</span>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-white leading-[1.1] tracking-tight">Tu mapa de talento empieza aquí.</h2>
            <p className="text-blue-100/50 text-lg leading-relaxed">
              Define tus habilidades actuales para que podamos mostrarle a las empresas tu verdadero valor Senior.
            </p>
          </div>

          <div className="mt-20 space-y-4">
             <div className="flex items-center gap-4 group">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all",
                  step === 1 ? "bg-white text-blue-900 scale-110 shadow-lg" : "bg-white/10 text-white/40"
                )}>1</div>
                <span className={cn("font-bold text-sm", step === 1 ? "text-white" : "text-white/40")}>Tu Perfil</span>
             </div>
             <div className="w-px h-6 bg-white/10 ml-5" />
             <div className="flex items-center gap-4 group">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all",
                  step === 2 ? "bg-white text-blue-900 scale-110 shadow-lg" : "bg-white/10 text-white/40"
                )}>2</div>
                <span className={cn("font-bold text-sm", step === 2 ? "text-white" : "text-white/40")}>Tus Habilidades</span>
             </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-100/30 text-xs font-medium">
          © 2026 Red de Bienestar Laboral.
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <motion.div 
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="max-w-[600px] w-full"
        >
          {step === 1 ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Cuentanos tu presente</h1>
                <p className="text-gray-500 font-medium italic">Esto nos ayuda a filtrar las mejores oportunidades.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Área en la que buscas</Label>
                  <Select onValueChange={(v) => updateFormData("area", v)} value={formData.area}>
                    <SelectTrigger className="h-16 rounded-2xl border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-gray-700 font-medium">
                      <SelectValue placeholder="Selecciona tu área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RRHH">RRHH / Gestión de Talento</SelectItem>
                      <SelectItem value="COM">Comercial / Ventas / MKT</SelectItem>
                      <SelectItem value="FIN">Finanzas / Legales</SelectItem>
                      <SelectItem value="OPS">Operaciones / Supply Chain</SelectItem>
                      <SelectItem value="IT">Tecnología / IT</SelectItem>
                      <SelectItem value="OTRO">Otro sector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Industria de preferencia</Label>
                  <Select onValueChange={(v) => updateFormData("industry", v)} value={formData.industry}>
                    <SelectTrigger className="h-16 rounded-2xl border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-600 transition-all text-gray-700 font-medium">
                      <SelectValue placeholder="Selecciona la industria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECH">Tecnología</SelectItem>
                      <SelectItem value="SERV">Servicios Profesionales</SelectItem>
                      <SelectItem value="CONS">Consumo Masivo / Retail</SelectItem>
                      <SelectItem value="AGRO">Agro / Manufactura</SelectItem>
                      <SelectItem value="OTRO">Otras industrias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">¿Estás trabajando actualmente?</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      className={cn(
                        "h-16 rounded-2xl border-2 transition-all font-bold",
                        formData.isWorking === "SI" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-50 bg-white hover:border-gray-100 text-gray-400"
                      )}
                      onClick={() => updateFormData("isWorking", "SI")}
                    >
                      Sí, actualmente
                    </button>
                    <button 
                      className={cn(
                        "h-16 rounded-2xl border-2 transition-all font-bold",
                        formData.isWorking === "NO" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-50 bg-white hover:border-gray-100 text-gray-400"
                      )}
                      onClick={() => updateFormData("isWorking", "NO")}
                    >
                      No por ahora
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!formData.area || !formData.industry || !formData.isWorking}
                className="w-full bg-[#003366] hover:bg-blue-900 h-16 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/10 transition-all"
              >
                Continuar a Habilidades <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-2">
                <button onClick={() => setStep(1)} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 mb-4 group">
                  <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Volver al paso anterior
                </button>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tus Habilidades Actuales</h1>
                <p className="text-gray-500 font-medium italic">Selecciona todas las herramientas y skills que dominas hoy.</p>
              </div>

              <div className="space-y-8">
                {skillCategories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <Label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] ml-1">{category.name}</Label>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2",
                            formData.selectedSkills.includes(skill)
                              ? "bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]"
                              : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || formData.selectedSkills.length === 0}
                className="w-full bg-[#003366] hover:bg-blue-900 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/10 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Generando tu Perfil..." : "Finalizar y Ver mi Ruta"}
                {!isSubmitting && <Sparkles className="w-5 h-5 text-yellow-400" />}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


