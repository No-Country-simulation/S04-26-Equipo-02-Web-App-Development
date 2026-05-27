import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import {
  getAllEvents,
  enrollEvent,
  createEvent,
  type BackendEvent,
  type CreateEventPayload,
} from '../../../api/events';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDayLabel(dayStr: string): { day: string; month: string } {
  const d = new Date(dayStr + 'T00:00:00');
  return {
    day: d.toLocaleDateString('es-ES', { day: '2-digit' }),
    month: d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
  };
}

function formatDayLong(dayStr: string): string {
  const d = new Date(dayStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Taller':
      return 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30';
    case 'Clase':
      return 'bg-brand-sage/15 text-brand-sage border border-brand-sage/30';
    default:
      return 'bg-brand-coral/15 text-brand-coral border border-brand-coral/30';
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'Taller':
      return '🛠️';
    case 'Clase':
      return '📚';
    default:
      return '📅';
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'Taller':
      return 'Taller';
    case 'Clase':
      return 'Clase';
    default:
      return type || 'Evento';
  }
}

function getEventStatus(dayStr: string): 'upcoming' | 'past' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dayStr + 'T00:00:00');
  return eventDate >= today ? 'upcoming' : 'past';
}

type FilterStatus = 'all' | 'upcoming' | 'past';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, type: 'spring', stiffness: 100, damping: 20 },
  },
} as const;

// ── Create Event Modal ───────────────────────────────────────────────────────

function CreateEventModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CreateEventPayload>({
    title: '',
    type: 'Taller',
    day: '',
    link: '',
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.day || !form.link) {
      toast.error('Completá todos los campos obligatorios');
      return;
    }
    setSaving(true);
    try {
      await createEvent(form);
      toast.success('Evento creado correctamente');
      onClose();
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-brand-heading">Crear Evento</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ev-title" className="text-sm font-bold text-gray-700">
              Título *
            </Label>
            <Input
              id="ev-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ej: Clase en Vivo: Buenas Prácticas en Git"
              className="rounded-2xl border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-type" className="text-sm font-bold text-gray-700">
              Tipo *
            </Label>
            <select
              id="ev-type"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage"
            >
              <option value="Taller">Taller</option>
              <option value="Clase">Clase</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-day" className="text-sm font-bold text-gray-700">
              Fecha *
            </Label>
            <Input
              id="ev-day"
              type="date"
              value={form.day}
              onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))}
              className="rounded-2xl border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-link" className="text-sm font-bold text-gray-700">
              Link de reunión *
            </Label>
            <Input
              id="ev-link"
              value={form.link}
              onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
              placeholder="https://meet.google.com/..."
              className="rounded-2xl border-gray-200"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-gray-200 text-gray-600 font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-2xl bg-brand-sage hover:bg-brand-sage-hover text-white font-bold shadow-md shadow-brand-sage/20"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Crear Evento'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  event,
  onEnroll,
  enrollingId,
}: {
  event: BackendEvent;
  onEnroll: (id: string) => void;
  enrollingId: string | null;
}) {
  const { user } = useAuth();
  const { day, month } = formatDayLabel(event.day);
  const status = getEventStatus(event.day);
  const isPast = status === 'past';

  const domain = (() => {
    try {
      return new URL(event.link).hostname.replace('www.', '');
    } catch {
      return event.link;
    }
  })();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group"
    >
      {/* Top Row: Type + Date Badge */}
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'rounded-full text-[10px] font-bold uppercase px-3 py-1',
            getTypeColor(event.type)
          )}
        >
          {getTypeIcon(event.type)} {getTypeLabel(event.type)}
        </span>

        <div className="flex flex-col items-center justify-center bg-brand-bg rounded-2xl px-3 py-2 min-w-[60px]">
          <span className="text-xl font-black text-brand-heading leading-none">
            {day}
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {month}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-black text-brand-heading leading-tight group-hover:text-brand-sage transition-colors duration-200">
        {event.title}
      </h3>

      {/* Date + Link */}
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-gray-500 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {formatDayLong(event.day)}
        </span>
      </div>

      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-brand-sage hover:text-brand-sage-hover transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {domain}
        </a>
      )}

      {/* Action Button */}
      <div className="pt-1">
        {isPast ? (
          <Button
            variant="outline"
            className="w-full rounded-2xl text-sm font-bold border-gray-200 text-gray-600"
            disabled
          >
            <Clock className="w-4 h-4" />
            Evento finalizado
          </Button>
        ) : user?.role === 'PROFESSIONAL' ? (
          <Button
            onClick={() => onEnroll(event.id)}
            disabled={enrollingId === event.id}
            className="w-full rounded-2xl text-sm font-bold bg-brand-sage hover:bg-brand-sage-hover text-white shadow-md shadow-brand-sage/20"
          >
            {enrollingId === event.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Inscribirme
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-2xl text-sm font-bold bg-brand-accent/50 hover:bg-brand-accent text-brand-charcoal py-2.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ir al evento
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ events }: { events: BackendEvent[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Days that have events (by month)
  const eventDaysByMonth = useMemo(() => {
    const map: Record<string, number[]> = {};
    events.forEach((ev) => {
      const d = new Date(ev.day + 'T00:00:00');
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map[key]) map[key] = [];
      if (!map[key].includes(d.getDate())) map[key].push(d.getDate());
    });
    return map;
  }, [events]);

  const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
  const eventDays = eventDaysByMonth[key] || [];

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const prevMonth = () =>
    setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-brand-heading tracking-tight">
          Calendario
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-sm font-bold text-gray-700 min-w-[120px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider py-2"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="wait">
          {calendarDays.map((day, i) => {
            const hasEvent = day !== null && eventDays.includes(day);
            const isToday =
              day !== null &&
              day === new Date().getDate() &&
              currentMonth.getMonth() === new Date().getMonth() &&
              currentMonth.getFullYear() === new Date().getFullYear();

            return (
              <motion.div
                key={`${key}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.01 }}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center text-sm rounded-xl relative',
                  day === null ? 'invisible' : '',
                  isToday
                    ? 'bg-brand-sage text-white font-bold shadow-md shadow-brand-sage/30'
                    : hasEvent
                    ? 'bg-brand-bg hover:bg-brand-accent/50 cursor-pointer font-medium text-brand-heading transition-colors'
                    : 'hover:bg-gray-50 text-gray-600 transition-colors'
                )}
              >
                {day}
                {hasEvent && !isToday && (
                  <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-brand-sage" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-sage" />
          <span className="text-[10px] font-medium text-gray-500">Con evento</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-brand-sage" />
          <span className="text-[10px] font-medium text-gray-500">Hoy</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllEvents()
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch((err) => {
        if (active) toast.error(handleApiError(err).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const status = getEventStatus(e.day);
      return (
        filterStatus === 'all' ||
        (filterStatus === 'upcoming' && status === 'upcoming') ||
        (filterStatus === 'past' && status === 'past')
      );
    });
  }, [events, filterStatus]);

  const handleEnroll = async (eventId: string) => {
    setEnrollingId(eventId);
    try {
      await enrollEvent(eventId);
      toast.success('Te inscribiste correctamente al evento');
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setEnrollingId(null);
  };

  const statusTabs: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'upcoming', label: 'Próximos' },
    { key: 'past', label: 'Pasados' },
  ];

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <PageMeta
          title="Eventos — Red de Bienestar Laboral"
          description="Cargando eventos..."
        />
        <Loader2 className="w-8 h-8 animate-spin text-brand-sage" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Eventos — ${user.name}` : 'Eventos y Webinars'}
        description="Capacitación, networking y crecimiento profesional en Red de Bienestar Laboral."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Eventos
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Talleres, clases y más
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setShowCreate(true)}
            className="rounded-2xl bg-brand-sage hover:bg-brand-sage-hover text-white shadow-md shadow-brand-sage/20 font-bold"
          >
            <Plus className="w-4 h-4" />
            Crear Evento
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300',
              filterStatus === tab.key
                ? 'bg-brand-sage text-white shadow-sm shadow-brand-sage/30'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${filterStatus}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEnroll={handleEnroll}
              enrollingId={enrollingId}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title="No hay eventos para mostrar"
          description={
            filterStatus !== 'all'
              ? 'Probá cambiando el filtro.'
              : 'Todavía no hay eventos programados. Volvé más tarde.'
          }
        />
      )}

      {/* Calendar */}
      <MiniCalendar events={events} />

      {/* Create Event Modal */}
      <CreateEventModal
        open={showCreate}
        onClose={() => {
          setShowCreate(false);
          // Refresh after creation
          getAllEvents().then(setEvents).catch(() => {});
        }}
      />
    </div>
  );
}
