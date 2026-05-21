import { useState, useEffect, useMemo, useCallback } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../lib/constants';
import { handleApiError, ApiError } from '@/lib/errors';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import ProfileSummaryCard, { type ProfessionalProfile } from '@/components/dashboard/ProfileSummaryCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import WeeklyTasks, { type Task } from '@/components/dashboard/WeeklyTasks';
import StatsCards from '@/components/dashboard/StatsCards';
import UpcomingActivities, { type Event } from '@/components/dashboard/UpcomingActivities';

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Mocks de eventos estéticos
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

  // Inicializar tareas semanales en localStorage
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

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${API_ENDPOINTS.profiles}/me`);
      if (res.data && res.data.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      const apiErr = handleApiError(err);
      toast.error(apiErr.message);
      setError(apiErr);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

  if (!user) {
    return (
      <EmptyState
        title="Iniciá sesión"
        description="Necesitás iniciar sesión para ver tu dashboard."
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4"><Skeleton variant="card" /></div>
          <div className="lg:col-span-3"><Skeleton variant="card" /></div>
          <div className="lg:col-span-5"><Skeleton variant="card" /></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchProfile} />;
  }

  const selectedSkills = profile?.skills || [];
  const completedTasksCount = weeklyTasks.filter(t => t.isCompleted).length;
  const tasksPercent = weeklyTasks.length > 0 ? Math.round((completedTasksCount / weeklyTasks.length) * 100) : 0;
  const profilePercent = profile?.completionScore || 15;

  const stats = [
    { label: 'Días en la Red', value: '32', change: 'Comunidad Activa', color: 'text-gray-900' },
    { label: 'Habilidades Registradas', value: String(selectedSkills.length), change: `${selectedSkills.length} cargadas`, color: 'text-gray-900' },
    { label: 'Eventos Asistidos', value: '9', change: 'Webinars + Talleres', color: 'text-gray-900' },
    { label: 'Nivel de Perfil', value: `${profilePercent}%`, change: 'Completado', color: 'text-[#C4A962]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
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

      {/* Row 1: Profile + Chart + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ProfileSummaryCard profile={profile} user={user} />
        <ProgressChart skillsLength={selectedSkills.length} profilePercent={profilePercent} />
        <WeeklyTasks tasks={weeklyTasks} onToggle={toggleTask} tasksPercent={tasksPercent} />
      </div>

      {/* Row 2: Stats */}
      <StatsCards stats={stats} />

      {/* Row 3: Upcoming Activities */}
      <UpcomingActivities events={upcomingEvents} formatDate={formatDate} />
    </div>
  );
}
