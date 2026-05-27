import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import {
  BookOpen,
  Award,
  Target,
  CheckCircle2,
  ArrowRight,
  Clock,
  Plus,
  TrendingUp,
  Star,
  Route,
  FileText,
  Brain,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorDisplay } from '@/components/ui/error-display';
import {
  getLearningPaths,
  getUserProgress,
  updateCourseProgress,
} from '../../../api/learning';
import type {
  CourseProgress,
  LearningPath as ApiLearningPath,
} from '../../../api/learning';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  category: string;
  icon: React.ElementType;
  rawStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface Skill {
  id: string;
  label: string;
}

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending';
}

// ─── Mock Data for skills ────────────────────────────────────────────────────

const SUGGESTED_SKILLS: Skill[] = [
  { id: 'skill-1', label: 'Comunicación Efectiva' },
  { id: 'skill-2', label: 'Pensamiento Crítico' },
  { id: 'skill-3', label: 'Gestión del Tiempo' },
  { id: 'skill-4', label: 'Trabajo en Equipo' },
  { id: 'skill-5', label: 'Adaptabilidad al Cambio' },
  { id: 'skill-6', label: 'Resolución de Problemas' },
  { id: 'skill-7', label: 'Inteligencia Emocional' },
  { id: 'skill-8', label: 'Liderazgo Digital' },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

const staggerList = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
} as const;

// ─── Progress Bar Sub-component ─────────────────────────────────────────────

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('h-2 bg-brand-accent/40 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className="h-full bg-brand-sage rounded-full"
      />
    </div>
  );
}

// ─── Course Card Sub-component ──────────────────────────────────────────────

interface CourseCardProps {
  course: Course;
  onAction: (courseId: string, currentStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => Promise<void>;
  actionLoading: boolean;
}

function CourseCard({ course, onAction, actionLoading }: CourseCardProps) {
  const Icon = course.icon;
  const isCompleted = course.rawStatus === 'COMPLETED';
  const isInProgress = course.rawStatus === 'IN_PROGRESS';

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="saas-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer text-left"
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-sage to-brand-olive" />

      <div className="flex flex-col flex-1 p-5">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-sage bg-brand-sage/10 px-2.5 py-1 rounded-full">
            <Icon className="w-3.5 h-3.5" />
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{course.duration}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-black text-brand-heading tracking-tight leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3 font-medium">
          {course.description}
        </p>

        {/* Progress */}
        {(isInProgress || isCompleted) && (
          <div className="mb-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Progreso
              </span>
              <span className="text-[10px] font-bold text-brand-sage">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        )}

        {/* CTA */}
        <button
          disabled={isCompleted || actionLoading}
          onClick={(e) => {
            e.stopPropagation();
            onAction(course.id, course.rawStatus);
          }}
          className={cn(
            'w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300',
            isCompleted
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
              : isInProgress
              ? 'bg-brand-sage/10 text-brand-sage hover:bg-brand-sage/20 border border-brand-sage/10'
              : 'bg-brand-sage text-white hover:bg-brand-olive active:scale-95 hover:shadow-lg hover:shadow-brand-sage/25 border border-brand-sage',
          )}
        >
          {isCompleted ? 'Completado' : (isInProgress ? 'Continuar' : 'Comenzar')}
          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function LearningSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Learning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progressList, setProgressList] = useState<CourseProgress[]>([]);
  const [allPaths, setAllPaths] = useState<ApiLearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const progress = await getUserProgress();
      setProgressList(progress);
      if (progress.length === 0) {
        const paths = await getLearningPaths();
        setAllPaths(paths);
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err.message || 'Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCourseAction = async (courseId: string, currentStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const nextStatus = currentStatus === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED';
      await updateCourseProgress(courseId, nextStatus);
      toast.success(nextStatus === 'IN_PROGRESS' ? '¡Curso iniciado!' : '¡Curso completado con éxito!');
      const progress = await getUserProgress();
      setProgressList(progress);
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSkill = (skillId: string) => {
    setAddedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.add(skillId);
      }
      return next;
    });
  };

  const stats = useMemo(() => {
    if (progressList.length === 0) return [];
    
    const completed = progressList.filter((p) => p.status === 'COMPLETED').length;
    const total = progressList.length;
    const inProgress = progressList.filter((p) => p.status === 'IN_PROGRESS').length;
    
    const categoryMapping: Record<string, string> = {
      DIGITAL: 'Digital',
      COGNITIVE: 'Cognitiva',
      SOCIOEMOTIONAL: 'Socioemocional',
    };
    
    const category = progressList[0]?.course.learningPath.category || '';
    const categoryText = categoryMapping[category] || category;

    return [
      {
        label: 'Cursos Completados',
        value: `${completed}`,
        sub: `de ${total} asignados`,
        icon: BookOpen,
        color: 'text-brand-sage',
        bg: 'bg-brand-sage/10',
      },
      {
        label: 'Cursos en Curso',
        value: `${inProgress}`,
        sub: 'activos en tu ruta',
        icon: Clock,
        color: 'text-brand-gold',
        bg: 'bg-brand-gold/10',
      },
      {
        label: 'Categoría Recom.',
        value: categoryText,
        sub: 'según tu diagnóstico',
        icon: Award,
        color: 'text-brand-olive',
        bg: 'bg-brand-olive/10',
      },
      {
        label: 'Skills Adquiridas',
        value: `${completed * 2}`,
        sub: 'con tus cursos finalizados',
        icon: Brain,
        color: 'text-brand-coral',
        bg: 'bg-brand-coral/10',
      },
    ];
  }, [progressList]);

  const roadmapSteps = useMemo(() => {
    const steps: Step[] = [
      {
        id: 'diagnostico',
        label: 'Diagnóstico',
        description: 'Evaluación finalizada',
        icon: FileText,
        status: 'completed',
      },
    ];

    progressList.forEach((p, index) => {
      const isCompleted = p.status === 'COMPLETED';
      const isFirstNotCompleted = !isCompleted && progressList.findIndex(x => x.status !== 'COMPLETED') === index;
      const status = isCompleted ? 'completed' : (isFirstNotCompleted ? 'current' : 'pending');
      
      let icon = BookOpen;
      if (p.course.learningPath.category === 'DIGITAL') icon = Layers;
      else if (p.course.learningPath.category === 'COGNITIVE') icon = Brain;
      else if (p.course.learningPath.category === 'SOCIOEMOTIONAL') icon = Star;

      steps.push({
        id: p.course.id,
        label: p.course.title,
        description: p.course.description,
        icon,
        status,
      });
    });

    return steps;
  }, [progressList]);

  const currentStepIndex = useMemo(() => {
    return roadmapSteps.findIndex((s) => s.status === 'current');
  }, [roadmapSteps]);

  const roadmapProgressPercent = useMemo(() => {
    if (currentStepIndex === -1) return 100;
    return (currentStepIndex / (roadmapSteps.length - 1)) * 100;
  }, [currentStepIndex, roadmapSteps]);

  const mappedCourses = useMemo(() => {
    return progressList.map((p) => {
      let progressPercentage = 0;
      if (p.status === 'COMPLETED') {
        progressPercentage = 100;
      } else if (p.status === 'IN_PROGRESS') {
        progressPercentage = 50;
      }

      let icon = BookOpen;
      if (p.course.learningPath.category === 'DIGITAL') icon = Layers;
      else if (p.course.learningPath.category === 'COGNITIVE') icon = Brain;
      else if (p.course.learningPath.category === 'SOCIOEMOTIONAL') icon = Star;

      return {
        id: p.course.id,
        title: p.course.title,
        description: p.course.description,
        duration: '10 hs',
        progress: progressPercentage,
        category: p.course.learningPath.title,
        icon,
        rawStatus: p.status,
      };
    });
  }, [progressList]);

  if (loading) return <LearningSkeleton />;

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  if (progressList.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700 text-left">
        <PageMeta
          title="Mi Ruta de Aprendizaje"
          description="Iniciá tu diagnóstico para obtener tu ruta de aprendizaje personalizada."
        />
        
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-brand-sage/15 flex items-center justify-center">
              <Route className="w-5 h-5 text-brand-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
              Mi Ruta de Aprendizaje
            </h1>
          </div>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest ml-[3.25rem]">
            Tu plan de desarrollo profesional personalizado
          </p>
        </div>

        {/* ── Diagnostic Invite Banner ──────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-brand-sage/10 to-brand-olive/5 rounded-3xl border border-brand-sage/20 p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 size-64 bg-brand-sage/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-sage/10 text-brand-sage rounded-full text-xs font-black uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" />
              Diagnóstico Pendiente
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-heading tracking-tight">
              Personalizá tu desarrollo profesional
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">
              Realizá nuestra evaluación de diagnóstico para analizar tus competencias digitales, cognitivas y socioemocionales. A partir de los resultados, generaremos automáticamente una ruta de aprendizaje recomendada a tu medida.
            </p>
            <button
              onClick={() => navigate('/dashboard/diagnostic')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-sage hover:bg-brand-sage-hover text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider"
            >
              Comenzar Diagnóstico
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Explore Paths Section ─────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-brand-heading tracking-tight">
              Explorá nuestras Rutas de Aprendizaje
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Descubrí los cursos disponibles en cada categoría
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {allPaths.map((path) => {
              let categoryColor = 'text-brand-sage bg-brand-sage/10 border-brand-sage/20';
              let Icon = BookOpen;
              if (path.category === 'DIGITAL') {
                categoryColor = 'text-blue-600 bg-blue-50 border-blue-100';
                Icon = TrendingUp;
              } else if (path.category === 'COGNITIVE') {
                categoryColor = 'text-purple-600 bg-purple-50 border-purple-100';
                Icon = Brain;
              } else if (path.category === 'SOCIOEMOTIONAL') {
                categoryColor = 'text-rose-600 bg-rose-50 border-rose-100';
                Icon = Star;
              }

              return (
                <div key={path.id} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="space-y-4">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", categoryColor)}>
                      <Icon className="w-3.5 h-3.5" />
                      {path.category}
                    </span>
                    <h3 className="text-base font-black text-brand-heading tracking-tight leading-snug">
                      {path.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {path.description}
                    </p>
                    
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Cursos incluidos ({path.courses.length})
                      </p>
                      <ul className="space-y-2">
                        {path.courses.map((course) => (
                          <li key={course.id} className="flex items-start gap-2 text-xs text-gray-600 font-semibold">
                            <span className="mt-1 size-1.5 rounded-full bg-brand-sage shrink-0" />
                            <span>{course.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <button
                      onClick={() => navigate('/dashboard/diagnostic')}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-brand-bg hover:bg-brand-accent/30 text-brand-sage font-black rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Desbloquear con Diagnóstico
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 animate-in fade-in duration-700 text-left"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageMeta
        title={user?.name ? `Mi Ruta de Aprendizaje — ${user.name}` : 'Mi Ruta de Aprendizaje'}
        description="Tu plan de desarrollo profesional personalizado en Red de Bienestar Laboral."
      />
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-brand-sage/15 flex items-center justify-center">
            <Route className="w-5 h-5 text-brand-sage" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Mi Ruta de Aprendizaje
          </h1>
        </div>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest ml-[3.25rem]">
          Tu plan de desarrollo profesional personalizado
        </p>
      </motion.div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn(
                'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-5',
                'shadow-sm shadow-gray-200/50 hover:shadow-md hover:shadow-gray-200/60',
                'transition-all duration-300',
              )}
            >
              <div className={cn('absolute -top-3 -right-3 size-14 rounded-full opacity-20', stat.bg)} />
              <div className="flex items-start justify-between">
                <div className={cn('size-9 rounded-xl flex items-center justify-center', stat.bg)}>
                  <Icon className={cn('w-4.5 h-4.5', stat.color)} />
                </div>
              </div>
              <div className="mt-3 space-y-0.5">
                <span className="text-2xl font-black text-brand-heading tracking-tight">
                  {stat.value}
                </span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">{stat.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Learning Path Roadmap ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="saas-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Route className="w-5 h-5 text-brand-sage" />
            <h2 className="text-lg font-black text-brand-heading tracking-tight">Tu Progreso</h2>
          </div>

          {/* Desktop horizontal roadmap */}
          <div className="hidden md:block">
            <div className="relative flex items-start justify-between">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-brand-accent/50" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-brand-sage transition-all duration-700"
                style={{
                  width: `${roadmapProgressPercent}%`,
                }}
              />

              {roadmapSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                const isPending = step.status === 'pending';
                const isLast = index === roadmapSteps.length - 1;

                return (
                  <div
                    key={step.id}
                    className={cn('relative flex flex-col items-center z-10', isLast ? '' : 'flex-1')}
                  >
                    <div
                      className={cn(
                        'size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                        isCompleted &&
                          'bg-brand-sage border-brand-sage text-white shadow-md shadow-brand-sage/25',
                        isCurrent &&
                          'bg-white border-brand-sage text-brand-sage shadow-md shadow-brand-sage/20 ring-4 ring-brand-sage/10',
                        isPending && 'bg-white border-gray-200 text-gray-300',
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                    </div>
                    <div className="mt-3 text-center max-w-[130px] mx-auto">
                      <p
                        className={cn(
                          'text-sm font-bold tracking-tight',
                          isCompleted && 'text-brand-sage',
                          isCurrent && 'text-brand-heading',
                          isPending && 'text-gray-400',
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile vertical roadmap */}
          <div className="md:hidden space-y-0">
            {roadmapSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              const isPending = step.status === 'pending';
              const isLast = index === roadmapSteps.length - 1;

              return (
                <div key={step.id} className="relative flex gap-4 pb-6">
                  {!isLast && (
                    <div
                      className={cn(
                        'absolute left-[19px] top-10 w-0.5 h-[calc(100%-1.5rem)]',
                        isCompleted ? 'bg-brand-sage' : 'bg-brand-accent/40',
                      )}
                    />
                  )}
                  <div className="relative z-10 flex-shrink-0 mt-0.5">
                    <div
                      className={cn(
                        'size-9 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                        isCompleted &&
                          'bg-brand-sage border-brand-sage text-white shadow-sm shadow-brand-sage/25',
                        isCurrent &&
                          'bg-white border-brand-sage text-brand-sage shadow-sm shadow-brand-sage/20 ring-4 ring-brand-sage/10',
                        isPending && 'bg-white border-gray-200 text-gray-300',
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Icon className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-bold tracking-tight',
                        isCompleted && 'text-brand-sage',
                        isCurrent && 'text-brand-heading',
                        isPending && 'text-gray-400',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">{step.description}</p>
                    {isCurrent && (
                      <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest text-brand-sage bg-brand-sage/10 px-2 py-0.5 rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Recommended Courses ───────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl bg-brand-gold/15 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-brand-gold" />
            </div>
            <h2 className="text-lg font-black text-brand-heading tracking-tight">
              Cursos Recomendados
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {mappedCourses.map((course) => (
            <CourseCard key={course.id} course={course} onAction={handleCourseAction} actionLoading={actionLoading} />
          ))}
        </div>
      </motion.div>

      {/* ── Habilidades a Desarrollar ─────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-5">
          <div className="size-9 rounded-2xl bg-brand-coral/15 flex items-center justify-center">
            <Target className="w-4.5 h-4.5 text-brand-coral" />
          </div>
          <h2 className="text-lg font-black text-brand-heading tracking-tight">
            Habilidades a Desarrollar
          </h2>
        </div>

        <motion.div
          variants={staggerList}
          initial="hidden"
          animate="visible"
          className="saas-card rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-wrap gap-3">
            {SUGGESTED_SKILLS.map((skill) => {
              const isAdded = addedSkills.has(skill.id);
              return (
                <motion.button
                  key={skill.id}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddSkill(skill.id)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border',
                    isAdded
                      ? 'bg-brand-sage text-white border-brand-sage shadow-sm shadow-brand-sage/20'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-sage/50 hover:text-brand-sage hover:bg-brand-bg/50',
                  )}
                >
                  {isAdded ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  {skill.label}
                </motion.button>
              );
            })}

            {/* Add custom skill button */}
            <motion.button
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand-sage hover:text-brand-sage hover:bg-brand-bg/50"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar habilidad
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
