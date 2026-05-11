"use client";

import { useState, useEffect } from "react";
import { 
  Map, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Play, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Trophy,
  Zap,
  Brain,
  Heart,
  Monitor,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModuleProgress {
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  score: number | null;
  startedAt: string | null;
  completedAt: string | null;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: "DIGITAL" | "SOCIOEMOCIONAL" | "COGNITIVO";
  contentType: string;
  durationMinutes: number;
  difficultyLevel: number;
  orderInPath: number;
  content: string | null;
  resourceUrl: string | null;
  progress: ModuleProgress;
}

interface CategoryStats {
  total: number;
  completed: number;
  percentage: number;
}

interface LearningData {
  modules: LearningModule[];
  grouped: {
    DIGITAL: LearningModule[];
    SOCIOEMOCIONAL: LearningModule[];
    COGNITIVO: LearningModule[];
  };
  stats: {
    totalModules: number;
    completedModules: number;
    inProgressModules: number;
    overallProgress: number;
    categoryStats: {
      DIGITAL: CategoryStats;
      SOCIOEMOCIONAL: CategoryStats;
      COGNITIVO: CategoryStats;
    };
  };
}

const categoryConfig = {
  DIGITAL: {
    label: "Habilidades Digitales",
    icon: Monitor,
    color: "#7B9E6B",
    bgLight: "#7B9E6B15",
    description: "Herramientas y competencias tecnológicas para el mundo laboral actual",
  },
  SOCIOEMOCIONAL: {
    label: "Habilidades Socioemocionales",
    icon: Heart,
    color: "#D4826A",
    bgLight: "#D4826A15",
    description: "Comunicación, resiliencia y liderazgo para conectar con equipos",
  },
  COGNITIVO: {
    label: "Habilidades Cognitivas",
    icon: Brain,
    color: "#D4C36A",
    bgLight: "#D4C36A15",
    description: "Pensamiento crítico, creatividad y adaptabilidad continua",
  },
};

const contentTypeLabels: Record<string, string> = {
  VIDEO: "Video",
  ARTICULO: "Artículo",
  QUIZ: "Quiz",
  TALLER: "Taller",
  LECTURA: "Lectura",
};

export default function RutaPage() {
  const [data, setData] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("DIGITAL");

  const fetchProgress = async () => {
    try {
      const res = await fetch("/api/learning/progress");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Error fetching learning progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function loadProgress() {
      try {
        const res = await fetch("/api/learning/progress");
        if (res.ok && !cancelled) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching learning progress:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProgress();
    return () => { cancelled = true; };
  }, []);

  const handleModuleAction = async (moduleId: string, action: "start" | "complete") => {
    setActionLoading(moduleId);
    try {
      const res = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, action }),
      });

      if (res.ok) {
        await fetchProgress();
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#2C2C2C] animate-spin" />
          <p className="text-sm text-[#6B6B6B] font-medium animate-pulse">Cargando tu ruta de aprendizaje...</p>
        </div>
      </div>
    );
  }

  if (!data || data.modules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-3">
            <Map className="w-8 h-8 text-[#7B9E6B]" /> Mi Ruta de Aprendizaje
          </h1>
          <p className="text-[#6B6B6B] text-lg">Tu camino personalizado hacia la reinvención profesional.</p>
        </div>
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EDE8DB] shadow-sm">
          <BookOpen className="w-16 h-16 text-[#9B9B9B] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Módulos en preparación</h3>
          <p className="text-[#6B6B6B] max-w-md mx-auto">
            Estamos preparando tu ruta personalizada. Los módulos estarán disponibles muy pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-3">
            <Map className="w-8 h-8 text-[#7B9E6B]" /> Mi Ruta de Aprendizaje
          </h1>
          <p className="text-[#6B6B6B] text-base">Tu camino personalizado hacia la reinvención profesional.</p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-[#EDE8DB] shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7B9E6B]/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#7B9E6B]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1A1A1A]">Progreso General</h3>
              <p className="text-xs text-[#9B9B9B]">
                {data.stats.completedModules} de {data.stats.totalModules} módulos completados
              </p>
            </div>
          </div>
          <span className="text-3xl font-black text-[#1A1A1A]">{data.stats.overallProgress}%</span>
        </div>
        <div className="h-3 w-full bg-[#EDE8DB] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.stats.overallProgress}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#7B9E6B] via-[#8B9A6B] to-[#D4C36A]"
          />
        </div>

        {/* Category mini bars */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((key) => {
            const cat = categoryConfig[key];
            const stats = data.stats.categoryStats[key];
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] font-bold text-[#9B9B9B] uppercase truncate">{cat.label.split(" ")[1]}</span>
                  <span className="text-[10px] font-bold text-[#1A1A1A] ml-auto">{stats.percentage}%</span>
                </div>
                <div className="h-1.5 bg-[#EDE8DB] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Categories */}
      <div className="space-y-5">
        {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((categoryKey, catIdx) => {
          const cat = categoryConfig[categoryKey];
          const modules = data.grouped[categoryKey];
          const stats = data.stats.categoryStats[categoryKey];
          const CatIcon = cat.icon;
          const isExpanded = expandedCategory === categoryKey;

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + catIdx * 0.1 }}
              className="bg-white rounded-3xl border border-[#EDE8DB] shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
                className="w-full flex items-center gap-4 p-6 hover:bg-[#F5F0E8]/30 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cat.bgLight }}
                >
                  <CatIcon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-lg font-black text-[#1A1A1A]">{cat.label}</h2>
                  <p className="text-xs text-[#9B9B9B] font-medium">{cat.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    className="text-xs font-bold border-0 rounded-xl px-3 py-1"
                    style={{ backgroundColor: cat.bgLight, color: cat.color }}
                  >
                    {stats.completed}/{stats.total}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#9B9B9B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#9B9B9B]" />
                  )}
                </div>
              </button>

              {/* Modules List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-3">
                      {modules.map((mod, modIdx) => {
                        const isModuleExpanded = expandedModule === mod.id;
                        const isLoading = actionLoading === mod.id;

                        return (
                          <motion.div
                            key={mod.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: modIdx * 0.05 }}
                            className={cn(
                              "rounded-2xl border transition-all",
                              mod.progress.status === "COMPLETED"
                                ? "border-[#7B9E6B]/30 bg-[#7B9E6B]/5"
                                : mod.progress.status === "IN_PROGRESS"
                                ? "border-[#D4C36A]/30 bg-[#D4C36A]/5"
                                : "border-[#EDE8DB] bg-[#F5F0E8]/30"
                            )}
                          >
                            {/* Module Header */}
                            <button
                              onClick={() => setExpandedModule(isModuleExpanded ? null : mod.id)}
                              className="w-full flex items-center gap-4 p-4"
                            >
                              {/* Status Icon */}
                              <div className="shrink-0">
                                {mod.progress.status === "COMPLETED" ? (
                                  <CheckCircle2 className="w-6 h-6 text-[#7B9E6B]" />
                                ) : mod.progress.status === "IN_PROGRESS" ? (
                                  <Play className="w-6 h-6 text-[#D4C36A] fill-[#D4C36A]" />
                                ) : (
                                  <Circle className="w-6 h-6 text-[#CBCBCB]" />
                                )}
                              </div>

                              {/* Module Info */}
                              <div className="flex-1 text-left min-w-0">
                                <h4
                                  className={cn(
                                    "font-bold text-sm truncate",
                                    mod.progress.status === "COMPLETED" ? "text-[#7B9E6B]" : "text-[#1A1A1A]"
                                  )}
                                >
                                  {mod.title}
                                </h4>
                                <p className="text-[11px] text-[#9B9B9B] font-medium truncate">{mod.description}</p>
                              </div>

                              {/* Meta */}
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="outline" className="text-[10px] font-bold rounded-lg border-[#EDE8DB] text-[#6B6B6B]">
                                  {contentTypeLabels[mod.contentType] || mod.contentType}
                                </Badge>
                                <div className="flex items-center gap-1 text-[10px] text-[#9B9B9B] font-bold">
                                  <Clock className="w-3 h-3" />
                                  {mod.durationMinutes}m
                                </div>
                              </div>
                            </button>

                            {/* Expanded Content */}
                            <AnimatePresence>
                              {isModuleExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-0 space-y-4">
                                    <div className="ml-10 pl-4 border-l-2 border-[#EDE8DB]">
                                      {/* Content Preview */}
                                      {mod.content && (
                                        <div className="text-sm text-[#6B6B6B] whitespace-pre-line leading-relaxed">
                                          {mod.content}
                                        </div>
                                      )}

                                      {/* Resource Link */}
                                      {mod.resourceUrl && (
                                        <a
                                          href={mod.resourceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-sm font-semibold mt-3 hover:underline"
                                          style={{ color: cat.color }}
                                        >
                                          <Zap className="w-4 h-4" /> Recurso externo
                                          <ArrowRight className="w-3 h-3" />
                                        </a>
                                      )}

                                      {/* Score display */}
                                      {mod.progress.status === "COMPLETED" && mod.progress.score !== null && (
                                        <div className="mt-3 flex items-center gap-2">
                                          <Sparkles className="w-4 h-4 text-[#C4A962]" />
                                          <span className="text-sm font-bold text-[#1A1A1A]">
                                            Score: {mod.progress.score}/100
                                          </span>
                                        </div>
                                      )}

                                      {/* Action Buttons */}
                                      <div className="mt-4 flex gap-3">
                                        {mod.progress.status === "NOT_STARTED" && (
                                          <Button
                                            onClick={() => handleModuleAction(mod.id, "start")}
                                            disabled={isLoading}
                                            className="rounded-xl font-bold text-sm px-6"
                                            style={{ backgroundColor: cat.color }}
                                          >
                                            {isLoading ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <>
                                                <Play className="w-4 h-4 mr-2" /> Iniciar Módulo
                                              </>
                                            )}
                                          </Button>
                                        )}
                                        {mod.progress.status === "IN_PROGRESS" && (
                                          <Button
                                            onClick={() => handleModuleAction(mod.id, "complete")}
                                            disabled={isLoading}
                                            className="rounded-xl font-bold text-sm px-6 bg-[#7B9E6B] hover:bg-[#6B8E5B]"
                                          >
                                            {isLoading ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Marcar como Completado
                                              </>
                                            )}
                                          </Button>
                                        )}
                                        {mod.progress.status === "COMPLETED" && (
                                          <div className="flex items-center gap-2 text-[#7B9E6B] font-bold text-sm">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Completado
                                            {mod.progress.completedAt && (
                                              <span className="text-[#9B9B9B] text-xs font-medium ml-1">
                                                · {new Date(mod.progress.completedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
