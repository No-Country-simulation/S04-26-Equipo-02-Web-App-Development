import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  TrendingUp,
  Star,
  Loader2,
  Circle,
  ArrowRight,
  Calendar,
  Users,
  Camera,
  Clock,
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  PolarGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../lib/constants';
import { Link } from 'react-router-dom';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../components/ui/chart';

const chartConfig = {
  value: {
    label: 'Progreso',
  },
  skills: {
    label: 'Habilidades',
    color: '#7B9E6B',
  },
  webinars: {
    label: 'Webinars',
    color: '#D4C36A',
  },
  talleres: {
    label: 'Talleres',
    color: '#D4826A',
  },
  networking: {
    label: 'Networking',
    color: '#8B9A6B',
  },
} satisfies ChartConfig;

interface ProfileSkill {
  id: string;
  skillId: string;
  isVerified: boolean;
  skill: {
    id: string;
    name: string;
    category: 'DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL';
  };
}

interface ProfessionalProfile {
  id: string;
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  valueProposition: string | null;
  yearsOfExperience: number | null;
  location: string | null;
  completionScore: number;
  skills: ProfileSkill[];
}

interface Task {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
}

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime: string;
  speaker: string;
}

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mocks de eventos estéticos (envueltos en useMemo para mantener la pureza de renderizado)
  const upcomingEvents = useMemo<Event[]>(() => [
    {
      id: 'event-1',
      title: 'Adaptabilidad laboral y nuevas tecnologías',
      type: 'Webinar',
      date: '2026-05-20T18:00:00.000Z',
      startTime: '18:00',
      speaker: 'Lic. Laura Martínez',
    },
    {
      id: 'event-2',
      title: 'Optimización de CV Vivo y perfil de LinkedIn',
      type: 'Taller',
      date: '2026-05-22T16:30:00.000Z',
      startTime: '16:30',
      speaker: 'Ing. Carlos Rossi',
    },
    {
      id: 'event-3',
      title: 'Networking: Encuentro mensual de la comunidad',
      type: 'Mesa Redonda',
      date: '2026-05-25T19:00:00.000Z',
      startTime: '19:00',
      speaker: 'Equipo Red de Bienestar',
    },
  ], []);

  // Inicializar tareas semanales en localStorage para la demo de forma perezosa (lazy state)
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>(() => {
    const storedEmail = localStorage.getItem('auth_user_email') || 'default';
    const storageKey = `weekly_tasks_${storedEmail}`;
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch {
        // ignore
      }
    }
    const defaultTasks: Task[] = [
      { id: 'task-1', title: 'Completar tu diagnóstico de competencias', category: 'Diagnóstico', isCompleted: false },
      { id: 'task-2', title: 'Explorar perfiles en el Marketplace de talento', category: 'Marketplace', isCompleted: false },
      { id: 'task-3', title: 'Completar tu primer curso recomendado', category: 'Mi Ruta', isCompleted: false },
      { id: 'task-4', title: 'Registrarse para el próximo webinar de la Red', category: 'Eventos', isCompleted: false },
    ];
    localStorage.setItem(storageKey, JSON.stringify(defaultTasks));
    return defaultTasks;
  });

  // Fetch de perfil
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`${API_ENDPOINTS.profiles}/me`);
        if (res.data && res.data.success) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const toggleTask = (taskId: string) => {
    const updated = weeklyTasks.map(t =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setWeeklyTasks(updated);
    const storageKey = `weekly_tasks_${user?.email || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7B9E6B] animate-spin" />
          <p className="text-sm text-gray-500 font-medium animate-pulse">Preparando tu espacio...</p>
        </div>
      </div>
    );
  }

  const selectedSkills = profile?.skills || [];
  const completedTasksCount = weeklyTasks.filter(t => t.isCompleted).length;
  const tasksPercent = weeklyTasks.length > 0 ? Math.round((completedTasksCount / weeklyTasks.length) * 100) : 0;
  const profilePercent = profile?.completionScore || 15;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Header — Hello, Name */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tight">
            Hola, {profile?.firstName || user?.firstName || 'Profesional'} 👋
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Tu espacio de crecimiento profesional y bienestar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#EDE8DB] p-2.5 rounded-2xl px-5 border border-[#D4C9A8]/30">
            <Star className="w-5 h-5 text-[#C4A962] fill-[#C4A962]" />
            <span className="font-bold text-[#1A1A1A]">1,250</span>
            <span className="text-[#9B9B9B] text-xs font-medium uppercase tracking-wider">XP</span>
          </div>
        </div>
      </div>

      {/* Row 1: Profile Summary Card + Progress Chart + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* PROFILE PHOTO & INFO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-28 h-28 rounded-full border-4 border-[#7B9E6B]/30 overflow-hidden shadow-inner group">
              <img
                src="/default-professional.png"
                alt="Profesional"
                className="w-full h-full object-cover"
              />
              <Link to="/dashboard/profile" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </Link>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900">
                {profile ? `${profile.firstName} ${profile.lastName}` : user?.name || 'Mi Perfil'}
              </h2>
              <p className="text-[#7B9E6B] font-bold text-xs uppercase tracking-wider">
                {profile?.professionalTitle || 'Profesional Senior'}
              </p>
              {profile?.location && (
                <p className="text-xs text-gray-400 font-medium">📍 {profile.location}</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-semibold uppercase">Propuesta de Valor</span>
            </div>
            <p className="text-xs text-gray-600 italic font-medium leading-relaxed">
              &quot;{profile?.valueProposition || 'Aporto valor a través de mi experiencia, liderazgo y resiliencia en equipos dinámicos.'}&quot;
            </p>
          </div>
        </motion.div>

        {/* PROGRESS CHART CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-between"
        >
          <div className="text-center space-y-1 w-full">
            <h3 className="text-base font-bold text-gray-900">Progreso</h3>
            <p className="text-xs text-gray-400 font-medium">Tus actividades en la plataforma</p>
          </div>

          <div className="relative w-full aspect-square max-w-[150px] mx-auto flex items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full"
            >
              <RadialBarChart
                data={[
                  { category: 'networking', value: 60, fill: 'var(--color-networking)' },
                  { category: 'talleres', value: 40, fill: 'var(--color-talleres)' },
                  { category: 'webinars', value: 80, fill: 'var(--color-webinars)' },
                  { category: 'skills', value: Math.min((selectedSkills.length / 5) * 100, 100) || 20, fill: 'var(--color-skills)' },
                ]}
                innerRadius={15}
                outerRadius={65}
                barSize={5}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="category" />}
                />
                <PolarGrid gridType="circle" />
                <RadialBar
                  dataKey="value"
                  background
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ChartContainer>
          </div>

          <div className="w-full grid grid-cols-2 gap-1.5 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7B9E6B]" />
              <span className="text-[8px] font-bold uppercase text-gray-400">Habilidades ({selectedSkills.length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4C36A]" />
              <span className="text-[8px] font-bold uppercase text-gray-400">Webinars (4)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4826A]" />
              <span className="text-[8px] font-bold uppercase text-gray-400">Talleres (2)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8B9A6B]" />
              <span className="text-[8px] font-bold uppercase text-gray-400">Networking (3)</span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 text-gray-900 font-black text-xl">
              <TrendingUp className="w-4 h-4 text-[#7B9E6B]" />
              <span>{profilePercent}%</span>
            </div>
            <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Perfil Completo</span>
          </div>
        </motion.div>

        {/* TASKS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Tareas de la Semana</h3>
            <span className="text-2xl font-black text-[#7B9E6B]">
              {tasksPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tasksPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-[#7B9E6B] via-[#8B9A6B] to-[#D4C36A]"
            />
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px]">
            {weeklyTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F5F0E8] transition-all group text-left"
              >
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0',
                  task.isCompleted ? 'bg-[#7B9E6B]/15 text-[#7B9E6B]' : 'bg-gray-100 text-gray-400 group-hover:text-gray-900'
                )}>
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn('font-semibold text-sm truncate', task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800')}>{task.title}</h4>
                  <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">{task.category}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Días en la Red', value: '32', change: 'Comunidad Activa', color: 'text-gray-900' },
          { label: 'Habilidades Registradas', value: String(selectedSkills.length), change: `${selectedSkills.length} cargadas`, color: 'text-gray-900' },
          { label: 'Eventos Asistidos', value: '9', change: 'Webinars + Talleres', color: 'text-gray-900' },
          { label: 'Nivel de Perfil', value: `${profilePercent}%`, change: 'Completado', color: 'text-[#C4A962]' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            className={cn(
              'rounded-3xl p-6 shadow-sm border',
              i === 3 ? 'bg-[#EDE8DB] border-[#D4C9A8]/30' : 'bg-white border-gray-100'
            )}
          >
            <h3 className={cn('text-3xl font-black', stat.color)}>{stat.value}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
            <p className="text-[10px] text-[#7B9E6B] font-bold mt-2 uppercase tracking-wide">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 3: Upcoming Activities */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Próximas Actividades</h2>
          <Link to="/dashboard/events" className="text-[#7B9E6B] font-bold text-sm hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingEvents.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4 cursor-pointer group transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full text-[9px] font-bold uppercase bg-gray-100 text-gray-500 px-3 py-1">
                  {item.type}
                </span>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.date)}
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <h3 className="font-black text-gray-900 leading-tight group-hover:text-[#7B9E6B] transition-colors">{item.title}</h3>
                <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  {item.speaker}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">{item.startTime} hs</span>
                </div>
                <button className="text-[10px] font-bold uppercase text-[#7B9E6B] hover:text-[#5E7A52] flex items-center gap-1">
                  Inscribirme <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
