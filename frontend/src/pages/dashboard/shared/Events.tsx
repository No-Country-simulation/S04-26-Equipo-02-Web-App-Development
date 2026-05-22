import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  User,
  Tag,
  Plus,
  ArrowRight,
  Play,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

// ── Types ────────────────────────────────────────────────────────────────────

interface EventMock {
  id: string;
  title: string;
  type: 'Webinar' | 'Taller' | 'Mesa Redonda' | 'Networking';
  date: string;
  startTime: string;
  speakerName: string;
  speakerTitle: string;
  description: string;
  capacity: number;
  registeredCount: number;
  price: 'Gratuito' | number;
  tags: string[];
  status: 'upcoming' | 'past';
}

type FilterStatus = 'all' | 'upcoming' | 'past';
type FilterType = EventMock['type'] | 'all';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const mockEvents: EventMock[] = [
  {
    id: 'evt-001',
    title: 'Liderazgo en entornos híbridos: Gestión de equipos distribuidos',
    type: 'Webinar',
    date: '2026-06-15T18:00:00.000Z',
    startTime: '18:00',
    speakerName: 'Dr. Mariana Fernández',
    speakerTitle: 'Consultora en Transformación Organizacional',
    description: 'Exploramos las mejores prácticas para liderar equipos en modalidad híbrida, manteniendo la cohesión y productividad.',
    capacity: 100,
    registeredCount: 87,
    price: 'Gratuito',
    tags: ['Liderazgo', 'Gestión de Equipos', 'Trabajo Híbrido'],
    status: 'upcoming',
  },
  {
    id: 'evt-002',
    title: 'Taller práctico: LinkedIn para profesionales IT',
    type: 'Taller',
    date: '2026-06-18T16:30:00.000Z',
    startTime: '16:30',
    speakerName: 'Ing. Pablo Rodríguez',
    speakerTitle: 'Senior Technical Recruiter @ TechHub',
    description: 'Aprendé a optimizar tu perfil de LinkedIn para atraer oportunidades laborales en tecnología.',
    capacity: 50,
    registeredCount: 42,
    price: 2500,
    tags: ['Tecnología', 'Marca Personal', 'Búsqueda Laboral'],
    status: 'upcoming',
  },
  {
    id: 'evt-003',
    title: 'Mesa Redonda: Salud mental en el trabajo tech',
    type: 'Mesa Redonda',
    date: '2026-06-22T19:00:00.000Z',
    startTime: '19:00',
    speakerName: 'Lic. Carla Soto',
    speakerTitle: 'Psicóloga Laboral especializada en Tech',
    description: 'Un espacio de diálogo sobre los desafíos de la salud mental en la industria tecnológica argentina.',
    capacity: 200,
    registeredCount: 156,
    price: 'Gratuito',
    tags: ['Salud Laboral', 'Bienestar', 'Tecnología'],
    status: 'upcoming',
  },
  {
    id: 'evt-004',
    title: 'Networking: Encuentro de profesionales de datos',
    type: 'Networking',
    date: '2026-06-25T18:30:00.000Z',
    startTime: '18:30',
    speakerName: 'Comunidad Data Argentina',
    speakerTitle: 'Meetup Oficial',
    description: 'Conectá con otros profesionales de datos, analytics y machine learning en un ambiente distendido.',
    capacity: 80,
    registeredCount: 61,
    price: 'Gratuito',
    tags: ['Datos', 'Networking', 'Analytics'],
    status: 'upcoming',
  },
  {
    id: 'evt-005',
    title: 'Webinar: Negociación salarial para profesionales tech',
    type: 'Webinar',
    date: '2026-06-30T17:00:00.000Z',
    startTime: '17:00',
    speakerName: 'Mg. Ana López',
    speakerTitle: 'Especialista en Recursos Humanos Tech',
    description: 'Conocé las tendencias salariales actuales y técnicas para negociar tu próxima oferta laboral con confianza.',
    capacity: 150,
    registeredCount: 128,
    price: 3500,
    tags: ['Carrera', 'Negociación', 'Recursos Humanos'],
    status: 'upcoming',
  },
  {
    id: 'evt-006',
    title: 'Taller: Introducción a la IA Generativa para no técnicos',
    type: 'Taller',
    date: '2026-07-05T15:00:00.000Z',
    startTime: '15:00',
    speakerName: 'Dr. Fernando Méndez',
    speakerTitle: 'Investigador en IA @ Universidad de Buenos Aires',
    description: 'Descubrí qué es la IA Generativa, cómo funciona y cómo podés aprovecharla en tu trabajo sin escribir código.',
    capacity: 100,
    registeredCount: 73,
    price: 'Gratuito',
    tags: ['Tecnología', 'IA', 'Innovación'],
    status: 'upcoming',
  },
  {
    id: 'evt-007',
    title: 'Webinar: Arquitectura de microservicios en la práctica',
    type: 'Webinar',
    date: '2026-05-10T19:00:00.000Z',
    startTime: '19:00',
    speakerName: 'Ing. Sebastián González',
    speakerTitle: 'Staff Engineer @ Mercado Libre',
    description: 'Una mirada profunda a los patrones y anti-patrones de microservicios desde la experiencia en producción.',
    capacity: 120,
    registeredCount: 115,
    price: 'Gratuito',
    tags: ['Arquitectura', 'Backend', 'Microservicios'],
    status: 'past',
  },
  {
    id: 'evt-008',
    title: 'Networking: Encuentro Women in Tech',
    type: 'Networking',
    date: '2026-05-20T18:00:00.000Z',
    startTime: '18:00',
    speakerName: 'WIT Argentina',
    speakerTitle: 'Comunidad Oficial',
    description: 'Un espacio seguro y de apoyo para mujeres en tecnología. Conectá, aprendé y crecé junto a otras profesionales.',
    capacity: 60,
    registeredCount: 58,
    price: 'Gratuito',
    tags: ['Diversidad', 'Inclusión', 'Comunidad'],
    status: 'past',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateShort(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('es-ES', { day: '2-digit' }),
    month: d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase(),
  };
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getTypeColor(type: EventMock['type']): string {
  switch (type) {
    case 'Webinar':
      return 'bg-brand-sage/15 text-brand-sage border border-brand-sage/30';
    case 'Taller':
      return 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30';
    case 'Mesa Redonda':
      return 'bg-brand-coral/15 text-brand-coral border border-brand-coral/30';
    case 'Networking':
      return 'bg-brand-olive/15 text-brand-olive border border-brand-olive/30';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
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

// ── Event Card ─────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: EventMock;
  index: number;
}

function EventCard({ event, index: _index }: EventCardProps) {
  const { day, month } = formatDateShort(event.date);
  const fillPercent = Math.round((event.registeredCount / event.capacity) * 100);
  const isHighDemand = fillPercent >= 80;
  const isPast = event.status === 'past';

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
          {event.type}
        </span>

        <div className="flex flex-col items-center justify-center bg-brand-bg rounded-2xl px-3 py-2 min-w-[60px]">
          <span className="text-xl font-black text-brand-heading leading-none">{day}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{month}</span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h3 className="font-black text-brand-heading leading-tight group-hover:text-brand-sage transition-colors duration-200">
          {event.title}
        </h3>
      </div>

      {/* Speaker */}
      <div className="flex items-center gap-2 text-xs">
        <div className="w-7 h-7 rounded-full bg-brand-accent/50 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 text-brand-charcoal" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-700">{event.speakerName}</span>
          <span className="text-gray-400 text-[10px] font-medium">{event.speakerTitle}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        {event.description}
      </p>

      {/* DateTime + Price row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateLong(event.date)}
          </span>
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {event.startTime} hs
          </span>
        </div>
        <span
          className={cn(
            'font-bold text-sm',
            event.price === 'Gratuito' ? 'text-brand-sage' : 'text-brand-heading'
          )}
        >
          {event.price === 'Gratuito' ? 'Gratuito' : `$${event.price.toLocaleString('es-AR')}`}
        </span>
      </div>

      {/* Capacity Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-gray-500 font-medium">
            <Users className="w-3.5 h-3.5" />
            {event.registeredCount} / {event.capacity} inscriptos
          </span>
          {isHighDemand && !isPast && (
            <span className="flex items-center gap-1 text-brand-coral font-bold text-[10px]">
              <AlertTriangle className="w-3 h-3" />
              Últimos cupos
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              isPast
                ? 'bg-gray-300'
                : isHighDemand
                ? 'bg-brand-coral'
                : 'bg-brand-sage'
            )}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-[9px] font-medium bg-gray-50 text-gray-500 border border-gray-100 rounded-full px-2.5 py-0.5"
          >
            <Tag className="w-2.5 h-2.5" />
            {tag}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <div className="pt-1">
        {isPast ? (
          <Button
            variant="outline"
            className="w-full rounded-2xl text-sm font-bold border-gray-200 text-gray-600 hover:text-brand-sage hover:border-brand-sage"
          >
            <Play className="w-4 h-4" />
            Ver grabación
          </Button>
        ) : (
          <Button
            className="w-full rounded-2xl text-sm font-bold bg-brand-sage hover:bg-brand-sage-hover text-white shadow-md shadow-brand-sage/20"
          >
            Inscribirme
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ── Calendar Placeholder ─────────────────────────────────────────────────────────

function CalendarPlaceholder() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Event days for current mock: June 15, 18, 22, 25, 30; July 5
  const eventDates: Record<string, number[]> = {
    '2026-5': [10, 20], // May (0-indexed)
    '2026-6': [15, 18, 22, 25, 30], // June
    '2026-7': [5], // July
  };

  const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
  const eventsThisMonth = eventDates[key] || [];

  // Build calendar grid
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const calendarDays: (number | null)[] = [];

  // Empty slots before first day
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-brand-heading tracking-tight">
          Vista Calendario
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

      {/* Day headers */}
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

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="wait">
          {calendarDays.map((day, i) => {
            const hasEvent = day !== null && eventsThisMonth.includes(day);
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

      {/* Legend */}
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

// ── Main Component ──────────────────────────────────────────────────────────────

export default function Events() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const isAdmin = user?.role === 'ADMIN';

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((e) => {
      const statusMatch =
        filterStatus === 'all' ||
        (filterStatus === 'upcoming' && e.status === 'upcoming') ||
        (filterStatus === 'past' && e.status === 'past');

      const typeMatch = filterType === 'all' || e.type === filterType;

      return statusMatch && typeMatch;
    });
  }, [filterStatus, filterType]);

  const statusTabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: mockEvents.length },
    { key: 'upcoming', label: 'Próximos', count: mockEvents.filter((e) => e.status === 'upcoming').length },
    { key: 'past', label: 'Pasados', count: mockEvents.filter((e) => e.status === 'past').length },
  ];

  const typeChips: FilterType[] = ['all', 'Webinar', 'Taller', 'Mesa Redonda', 'Networking'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Eventos y Webinars
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Capacitación, networking y crecimiento profesional
          </p>
        </div>

        {isAdmin && (
          <Button className="rounded-2xl bg-brand-sage hover:bg-brand-sage-hover text-white shadow-md shadow-brand-sage/20 font-bold">
            <Plus className="w-4 h-4" />
            Crear Evento
          </Button>
        )}
      </div>

      {/* Filter Tabs + Chips */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300',
                filterStatus === tab.key
                  ? 'bg-brand-sage text-white shadow-sm shadow-brand-sage/30'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full',
                  filterStatus === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Type Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
            Filtrar por tipo:
          </span>
          {typeChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setFilterType(chip)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border',
                filterType === chip
                  ? chip !== 'all'
                    ? getTypeColor(chip as EventMock['type'])
                    : 'bg-brand-sage text-white border-brand-sage shadow-sm shadow-brand-sage/20'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              )}
            >
              {chip === 'all' ? 'Todos' : chip}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${filterStatus}-${filterType}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {filteredEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title="No hay eventos para mostrar"
          description="Probá ajustando los filtros o volvé más tarde."
        />
      )}

      {/* Calendar Section */}
      <CalendarPlaceholder />
    </div>
  );
}
