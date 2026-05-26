import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Plus,
  Search,
  MapPin,
  Users,
  Eye,
  Calendar,
  Clock,
  MoreHorizontal,
  Edit3,
  PauseCircle,
  XCircle,
  Briefcase,
  Building2,
  Filter,
  FileText,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type JobStatus = 'Activa' | 'En revisión' | 'Cerrada' | 'Borrador';
type Modality = 'Remoto' | 'Híbrido' | 'Presencial';

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  modality: Modality;
  status: JobStatus;
  postedDate: string;
  applicantCount: number;
  viewsCount: number;
  expirationDate: string;
  vacancies: number;
  daysSincePosted: number;
}

interface StatusTab {
  label: string;
  key: JobStatus | 'all';
  count: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockPublications: JobPosting[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Desarrollo',
    location: 'Buenos Aires',
    modality: 'Híbrido',
    status: 'Activa',
    postedDate: '15/04/2026',
    applicantCount: 12,
    viewsCount: 320,
    expirationDate: '15/07/2026',
    vacancies: 3,
    daysSincePosted: 36,
  },
  {
    id: 2,
    title: 'Backend Engineer Node.js',
    department: 'Tecnología',
    location: 'Córdoba',
    modality: 'Remoto',
    status: 'Activa',
    postedDate: '20/04/2026',
    applicantCount: 8,
    viewsCount: 250,
    expirationDate: '20/07/2026',
    vacancies: 2,
    daysSincePosted: 31,
  },
  {
    id: 3,
    title: 'Tech Lead React',
    department: 'Desarrollo',
    location: 'Capital Federal',
    modality: 'Híbrido',
    status: 'En revisión',
    postedDate: '25/04/2026',
    applicantCount: 5,
    viewsCount: 190,
    expirationDate: '25/07/2026',
    vacancies: 1,
    daysSincePosted: 26,
  },
  {
    id: 4,
    title: 'UX/UI Designer Senior',
    department: 'Diseño',
    location: 'Rosario',
    modality: 'Remoto',
    status: 'Activa',
    postedDate: '01/05/2026',
    applicantCount: 15,
    viewsCount: 310,
    expirationDate: '01/08/2026',
    vacancies: 2,
    daysSincePosted: 20,
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Infraestructura',
    location: 'Buenos Aires',
    modality: 'Presencial',
    status: 'Cerrada',
    postedDate: '10/03/2026',
    applicantCount: 7,
    viewsCount: 160,
    expirationDate: '10/06/2026',
    vacancies: 2,
    daysSincePosted: 72,
  },
  {
    id: 6,
    title: 'Data Analyst',
    department: 'Datos',
    location: 'Córdoba',
    modality: 'Remoto',
    status: 'Borrador',
    postedDate: '—',
    applicantCount: 0,
    viewsCount: 0,
    expirationDate: '—',
    vacancies: 2,
    daysSincePosted: 0,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusTabs: StatusTab[] = [
  { label: 'Todas', key: 'all', count: mockPublications.length },
  { label: 'Activas', key: 'Activa', count: mockPublications.filter((p) => p.status === 'Activa').length },
  { label: 'En revisión', key: 'En revisión', count: mockPublications.filter((p) => p.status === 'En revisión').length },
  { label: 'Cerradas', key: 'Cerrada', count: mockPublications.filter((p) => p.status === 'Cerrada').length },
  { label: 'Borradores', key: 'Borrador', count: mockPublications.filter((p) => p.status === 'Borrador').length },
];

const statusColors: Record<JobStatus, { badge: string; dot: string; bg: string }> = {
  Activa: {
    badge: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500',
    bg: 'bg-green-50/50',
  },
  'En revisión': {
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
    bg: 'bg-yellow-50/50',
  },
  Cerrada: {
    badge: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-400',
    bg: 'bg-gray-50/50',
  },
  Borrador: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    bg: 'bg-slate-50/50',
  },
};

const modalityStyles: Record<Modality, { icon: typeof MapPin; label: string }> = {
  Remoto: { icon: Building2, label: 'Remoto' },
  Híbrido: { icon: Building2, label: 'Híbrido' },
  Presencial: { icon: MapPin, label: 'Presencial' },
};

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 0)}k`;
  return String(n);
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Publications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Derived data
  const totalActivas = mockPublications.filter((p) => p.status === 'Activa').length;
  const totalPostulantes = mockPublications.reduce((acc, p) => acc + p.applicantCount, 0);
  const totalVistas = mockPublications.reduce((acc, p) => acc + p.viewsCount, 0);

  const filtered = mockPublications.filter((p) => {
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.modality.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Publicaciones — ${user.name}` : 'Mis Publicaciones'}
        description="Gestioná tus ofertas laborales activas en Red de Bienestar Laboral."
      />
      {/* ---------------------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Mis Publicaciones
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Gestioná tus ofertas laborales activas
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-brand-sage hover:bg-brand-sage-hover text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-brand-sage/25 active:scale-95 text-sm">
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Summary Stats Bar */}
      {/* ---------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Publicaciones', value: mockPublications.length, icon: FileText, color: 'text-brand-sage', bg: 'bg-brand-bg' },
          { label: 'Activas', value: totalActivas, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Postulantes Totales', value: totalPostulantes, icon: Users, color: 'text-brand-gold', bg: 'bg-amber-50' },
          { label: 'Vistas Totales', value: formatViews(totalVistas), icon: Eye, color: 'text-brand-coral', bg: 'bg-red-50' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
            )}
          >
            <div className={cn('p-3 rounded-xl shrink-0', stat.bg)}>
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-brand-heading">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Tabs + Search Bar */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all',
                activeTab === tab.key
                  ? 'bg-brand-charcoal text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-sage/50 hover:text-brand-sage',
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[9px] font-black px-1.5',
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-brand-bg text-gray-500',
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar publicaciones..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 placeholder:text-gray-400 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/10 outline-none transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-brand-sage/50 hover:text-brand-sage transition-all text-gray-500">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-brand-sage/50 hover:text-brand-sage transition-all text-gray-500">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Posting Cards */}
      {/* ---------------------------------------------------------------- */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
          <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-brand-heading mb-1">No hay publicaciones</h3>
          <p className="text-gray-400 font-semibold text-sm max-w-xs mx-auto">
            {searchQuery
              ? 'Ninguna publicación coincide con tu búsqueda. Probá con otros términos.'
              : 'Todavía no tenés publicaciones en esta categoría.'}
          </p>
        </div>
      ) : (
        <motion.div
          key={activeTab + searchQuery}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {filtered.map((job) => {
            const ModIcon = modalityStyles[job.modality].icon;
            const isExpired =
              job.status === 'Cerrada' && job.expirationDate !== '—';
            const progressPercent =
              job.vacancies > 0
                ? Math.min(Math.round((job.applicantCount / (job.vacancies * 5)) * 100), 100)
                : 0;
            const progressColor =
              progressPercent >= 80
                ? 'bg-brand-coral'
                : progressPercent >= 50
                  ? 'bg-brand-gold'
                  : 'bg-brand-sage';

            return (
              <motion.div
                key={job.id}
                variants={cardVariants}
                className={cn(
                  'bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
                  job.status === 'Borrador' && 'border-dashed opacity-80 hover:opacity-100',
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left content */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Title row + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-black text-brand-heading tracking-tight">
                          {job.title}
                        </h3>
                        <p className="text-sm font-bold text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {job.department}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider',
                          statusColors[job.status].badge,
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusColors[job.status].dot)} />
                        {job.status}
                      </span>
                    </div>

                    {/* Location + modality */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {job.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1">
                        <ModIcon className="w-3.5 h-3.5 text-gray-400" />
                        {modalityStyles[job.modality].label}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {job.postedDate !== '—' ? `Publicada ${job.postedDate}` : 'Sin publicar'}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-5 text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1.5 bg-brand-bg rounded-lg">
                          <Users className="w-3.5 h-3.5 text-brand-sage" />
                        </div>
                        <span className="font-black text-brand-heading">{job.applicantCount}</span>
                        <span className="text-gray-400 font-semibold text-xs">postulantes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="p-1.5 bg-amber-50 rounded-lg">
                          <Eye className="w-3.5 h-3.5 text-brand-gold" />
                        </div>
                        <span className="font-black text-brand-heading">{formatViews(job.viewsCount)}</span>
                        <span className="text-gray-400 font-semibold text-xs">vistas</span>
                      </div>
                      {job.daysSincePosted > 0 && (
                        <div className="flex items-center gap-1.5">
                          <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <span className="font-semibold text-gray-500 text-xs">
                            hace {job.daysSincePosted} días
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-col items-stretch lg:items-end gap-3 shrink-0">
                    {/* "Ver postulantes" button */}
                    <button
                      className={cn(
                        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95',
                        job.applicantCount > 0
                          ? 'bg-brand-sage hover:bg-brand-sage-hover text-white shadow-brand-sage/20'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                      )}
                      disabled={job.applicantCount === 0}
                    >
                      <Users className="w-4 h-4" />
                      Ver postulantes
                      {job.applicantCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-white/20 text-[10px] font-black px-1.5">
                          {job.applicantCount}
                        </span>
                      )}
                    </button>

                    {/* Actions dropdown */}
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:border-brand-sage/50 hover:text-brand-sage transition-all text-gray-400"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {openMenuId === job.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-white rounded-2xl border border-gray-100 shadow-xl py-1.5 overflow-hidden"
                        >
                          {[
                            { label: 'Editar', icon: Edit3, onClick: () => {} },
                            ...(job.status === 'Activa'
                              ? [{ label: 'Pausar', icon: PauseCircle, onClick: () => {} }]
                              : []),
                            ...(job.status !== 'Cerrada'
                              ? [{ label: 'Cerrar', icon: XCircle, onClick: () => {}, danger: true }]
                              : []),
                          ].map((action) => (
                            <button
                              key={action.label}
                              onClick={() => {
                                action.onClick();
                                setOpenMenuId(null);
                              }}
                              className={cn(
                                'w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-all text-left',
                                action.danger
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-gray-600 hover:bg-brand-bg hover:text-brand-heading',
                              )}
                            >
                              <action.icon className="w-4 h-4" />
                              {action.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {job.status !== 'Borrador' && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Progreso de postulaciones
                      </span>
                      <span className="text-[10px] font-black text-brand-heading">
                        {job.applicantCount} / {job.vacancies * 5} post.
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', progressColor)}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[9px] text-gray-400 font-semibold">
                        {job.vacancies} vacante{job.vacancies !== 1 ? 's' : ''}
                      </span>
                      {isExpired && (
                        <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Vencida el {job.expirationDate}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
