import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  ScrollText,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorDisplay } from '@/components/ui/error-display';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  category: string;
  icon: React.ElementType;
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

// ─── Mock Data ───────────────────────────────────────────────────────────────

const LEARNING_STEPS: Step[] = [
  {
    id: 'diagnostico',
    label: 'Diagnóstico',
    description: 'Evaluación de competencias',
    icon: FileText,
    status: 'completed',
  },
  {
    id: 'fundamentos',
    label: 'Fundamentos',
    description: 'Bases del desarrollo profesional',
    icon: Layers,
    status: 'current',
  },
  {
    id: 'especializacion',
    label: 'Especialización',
    description: 'Profundizá en tu área',
    icon: Brain,
    status: 'pending',
  },
  {
    id: 'certificacion',
    label: 'Certificación',
    description: 'Validá tus conocimientos',
    icon: ScrollText,
    status: 'pending',
  },
  {
    id: 'mentoria',
    label: 'Mentoría',
    description: 'Acompañamiento personalizado',
    icon: UserCheck,
    status: 'pending',
  },
];

const RECOMMENDED_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Liderazgo y Gestión de Equipos',
    description:
      'Desarrollá habilidades de liderazgo, comunicación efectiva y gestión de equipos remotos para potenciar tu carrera.',
    duration: '12 hs',
    progress: 0,
    category: 'Liderazgo',
    icon: Star,
  },
  {
    id: 'course-2',
    title: 'Transformación Digital y Nuevas Tecnologías',
    description:
      'Actualizate en las tendencias digitales que están transformando el mercado laboral actual.',
    duration: '8 hs',
    progress: 35,
    category: 'Tecnología',
    icon: TrendingUp,
  },
  {
    id: 'course-3',
    title: 'Inteligencia Emocional en el Ámbito Laboral',
    description:
      'Aprendé a gestionar emociones, mejorar relaciones interpersonales y fortalecer tu bienestar en el trabajo.',
    duration: '6 hs',
    progress: 0,
    category: 'Bienestar',
    icon: Brain,
  },
  {
    id: 'course-4',
    title: 'Marca Personal y Networking Estratégico',
    description:
      'Construí tu marca profesional, optimizá tu presencia digital y generá conexiones de valor.',
    duration: '10 hs',
    progress: 72,
    category: 'Desarrollo',
    icon: Target,
  },
];

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

function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;
  const hasProgress = course.progress > 0;

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="saas-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-sage to-brand-olive" />

      <div className="flex flex-col flex-1 p-5">
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-sage bg-brand-sage/10 px-2.5 py-1 rounded-full">
            <Icon className="w-3 h-3" />
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{course.duration}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-black text-brand-heading tracking-tight leading-snug mb-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
          {course.description}
        </p>

        {/* Progress */}
        {hasProgress && (
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
          className={cn(
            'w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300',
            hasProgress
              ? 'bg-brand-sage/10 text-brand-sage hover:bg-brand-sage/20'
              : 'bg-brand-sage text-white hover:bg-brand-olive active:scale-95 hover:shadow-lg hover:shadow-brand-sage/25',
          )}
        >
          {hasProgress ? 'Continuar' : 'Comenzar'}
          <ArrowRight className="w-3.5 h-3.5" />
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
        <Skeleton variant="text" className="h-10 w-72" />
        <Skeleton variant="text" className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-28" />
        ))}
      </div>
      <Skeleton variant="card" className="h-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
      <Skeleton variant="card" className="h-32" />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Learning() {
  const [loading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [addedSkills, setAddedSkills] = useState<Set<string>>(new Set());

  const stats = useMemo(
    () => [
      {
        label: 'Cursos Completados',
        value: '8',
        sub: 'de 12 disponibles',
        icon: BookOpen,
        color: 'text-brand-sage',
        bg: 'bg-brand-sage/10',
      },
      {
        label: 'Horas de Estudio',
        value: '124',
        sub: 'en los últimos 30 días',
        icon: Clock,
        color: 'text-brand-gold',
        bg: 'bg-brand-gold/10',
      },
      {
        label: 'Certificaciones',
        value: '3',
        sub: 'obtenidas este año',
        icon: Award,
        color: 'text-brand-olive',
        bg: 'bg-brand-olive/10',
      },
      {
        label: 'Skills Adquiridas',
        value: '14',
        sub: '+2 este mes',
        icon: Brain,
        color: 'text-brand-coral',
        bg: 'bg-brand-coral/10',
      },
    ],
    [],
  );

  if (loading) return <LearningSkeleton />;

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  if (!stats.length) {
    return (
      <EmptyState
        icon={Route}
        title="No hay datos disponibles"
        description="No pudimos cargar tu ruta de aprendizaje. Intentalo de nuevo."
      />
    );
  }

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

  return (
    <motion.div
      className="space-y-8 animate-in fade-in duration-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
                  width: `${(LEARNING_STEPS.findIndex((s) => s.status === 'current') /
                    (LEARNING_STEPS.length - 1)) *
                    100}%`,
                }}
              />

              {LEARNING_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                const isPending = step.status === 'pending';
                const isLast = index === LEARNING_STEPS.length - 1;

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
                    <div className="mt-3 text-center max-w-[130px]">
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
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">
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
            {LEARNING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              const isPending = step.status === 'pending';
              const isLast = index === LEARNING_STEPS.length - 1;

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
          <button className="btn-secondary text-xs gap-1.5 py-2 px-4">
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {RECOMMENDED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
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
