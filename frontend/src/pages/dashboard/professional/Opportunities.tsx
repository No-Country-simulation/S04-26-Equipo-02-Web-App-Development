import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  DollarSign,
  ArrowRight,
  Briefcase,
  Clock,
  SlidersHorizontal,
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';

// ─── Types ────────────────────────────────────────────────────────────────────

type JobType = 'Tiempo Completo' | 'Medio Tiempo' | 'Freelance';
type Modality = 'Remoto' | 'Presencial' | 'Híbrido';

interface JobOpportunity {
  id: number;
  company: string;
  position: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: JobType;
  modality: Modality;
  skills: string[];
  postedDaysAgo: number;
  matchScore: number;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOpportunities: JobOpportunity[] = [
  {
    id: 1,
    company: 'TechSolutions AR',
    position: 'Desarrollador/a Frontend Senior',
    location: 'CABA',
    salaryMin: 4500000,
    salaryMax: 5500000,
    type: 'Tiempo Completo',
    modality: 'Remoto',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    postedDaysAgo: 2,
    matchScore: 95,
    description: 'Buscamos un perfil senior para liderar el desarrollo de interfaces modernas en nuestro equipo de producto.',
  },
  {
    id: 2,
    company: 'InnovaTech',
    position: 'UX/UI Designer Senior',
    location: 'Córdoba',
    salaryMin: 3800000,
    salaryMax: 4800000,
    type: 'Tiempo Completo',
    modality: 'Híbrido',
    skills: ['Figma', 'Design System', 'Prototyping', 'User Research'],
    postedDaysAgo: 1,
    matchScore: 88,
    description: 'Sumate a nuestro equipo de diseño para crear experiencias digitales inclusivas y accesibles.',
  },
  {
    id: 3,
    company: 'DataWise Consulting',
    position: 'Data Scientist',
    location: 'CABA',
    salaryMin: 5000000,
    salaryMax: 7000000,
    type: 'Tiempo Completo',
    modality: 'Presencial',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    postedDaysAgo: 5,
    matchScore: 72,
    description: 'Buscamos un/a Data Scientist para desarrollar modelos predictivos en el sector financiero.',
  },
  {
    id: 4,
    company: 'EcoSoluciones',
    position: 'Project Manager IT',
    location: 'Mendoza',
    salaryMin: 4000000,
    salaryMax: 5200000,
    type: 'Tiempo Completo',
    modality: 'Presencial',
    skills: ['Agile', 'Scrum', 'Jira', 'Liderazgo'],
    postedDaysAgo: 3,
    matchScore: 65,
    description: 'Liderá proyectos de transformación digital en una empresa comprometida con el medio ambiente.',
  },
  {
    id: 5,
    company: 'DevRemote LATAM',
    position: 'Backend Developer (Node.js)',
    location: 'Remoto',
    salaryMin: 4200000,
    salaryMax: 5800000,
    type: 'Freelance',
    modality: 'Remoto',
    skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    postedDaysAgo: 0,
    matchScore: 91,
    description: 'Proyecto freelance para diseñar y construir APIs escalables en la nube.',
  },
  {
    id: 6,
    company: 'Grupo Nexo',
    position: 'Analista Funcional',
    location: 'Rosario',
    salaryMin: 3200000,
    salaryMax: 4000000,
    type: 'Medio Tiempo',
    modality: 'Híbrido',
    skills: ['SQL', 'UML', 'Documentación', 'Comunicación'],
    postedDaysAgo: 7,
    matchScore: 58,
    description: 'Necesitamos un perfil analítico para relevar requerimientos y documentar procesos.',
  },
  {
    id: 7,
    company: 'CloudBase SRL',
    position: 'DevOps Engineer',
    location: 'CABA',
    salaryMin: 5500000,
    salaryMax: 7500000,
    type: 'Tiempo Completo',
    modality: 'Remoto',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    postedDaysAgo: 4,
    matchScore: 82,
    description: 'Optimizá nuestra infraestructura cloud y automatizá procesos de deploy.',
  },
  {
    id: 8,
    company: 'Agencia Crear',
    position: 'Content Manager',
    location: 'La Plata',
    salaryMin: 2800000,
    salaryMax: 3500000,
    type: 'Freelance',
    modality: 'Híbrido',
    skills: ['SEO', 'Copywriting', 'WordPress', 'Analytics'],
    postedDaysAgo: 6,
    matchScore: 45,
    description: 'Gestioná la estrategia de contenido para nuestras cuentas corporativas.',
  },
  {
    id: 9,
    company: 'Fintech Pro',
    position: 'Mobile Developer (React Native)',
    location: 'CABA',
    salaryMin: 4800000,
    salaryMax: 6200000,
    type: 'Tiempo Completo',
    modality: 'Presencial',
    skills: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    postedDaysAgo: 1,
    matchScore: 90,
    description: 'Desarrollá la próxima generación de nuestra app financiera con React Native.',
  },
  {
    id: 10,
    company: 'BioHealth Labs',
    position: 'QA Automation Engineer',
    location: 'Mar del Plata',
    salaryMin: 3500000,
    salaryMax: 4800000,
    type: 'Tiempo Completo',
    modality: 'Híbrido',
    skills: ['Selenium', 'Cypress', 'JavaScript', 'API Testing'],
    postedDaysAgo: 8,
    matchScore: 76,
    description: 'Asegurá la calidad de nuestras plataformas de salud digital con automatización.',
  },
  {
    id: 11,
    company: 'GreenSoft',
    position: 'Frontend Developer Jr',
    location: 'Salta',
    salaryMin: 2200000,
    salaryMax: 3000000,
    type: 'Tiempo Completo',
    modality: 'Presencial',
    skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
    postedDaysAgo: 10,
    matchScore: 30,
    description: 'Primera experiencia laboral en desarrollo frontend con tecnologías web modernas.',
  },
  {
    id: 12,
    company: 'Horizon Media',
    position: 'Full Stack Developer',
    location: 'CABA',
    salaryMin: 5000000,
    salaryMax: 6500000,
    type: 'Tiempo Completo',
    modality: 'Remoto',
    skills: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
    postedDaysAgo: 3,
    matchScore: 85,
    description: 'Construí features end-to-end en una plataforma de medios con alcance regional.',
  },
];

// ─── Filter & Sort Options ────────────────────────────────────────────────────

const typeOptions = [
  { value: '', label: 'Todas' },
  { value: 'Tiempo Completo', label: 'Tiempo Completo' },
  { value: 'Medio Tiempo', label: 'Medio Tiempo' },
  { value: 'Freelance', label: 'Freelance' },
] as const;

const modalityOptions = [
  { value: '', label: 'Todas' },
  { value: 'Remoto', label: 'Remoto' },
  { value: 'Presencial', label: 'Presencial' },
  { value: 'Híbrido', label: 'Híbrido' },
] as const;

const locationOptions = [
  { value: '', label: 'Todas' },
  { value: 'CABA', label: 'CABA' },
  { value: 'Córdoba', label: 'Córdoba' },
  { value: 'Mendoza', label: 'Mendoza' },
  { value: 'Rosario', label: 'Rosario' },
  { value: 'La Plata', label: 'La Plata' },
  { value: 'Mar del Plata', label: 'Mar del Plata' },
  { value: 'Salta', label: 'Salta' },
  { value: 'Remoto', label: 'Remoto (cualquier ubicación)' },
] as const;

const sortOptions = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'recientes', label: 'Más recientes' },
  { value: 'salario', label: 'Mayor salario' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSalary(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1).replace('.', ',')}M`;
  }
  return `$${amount.toLocaleString('es-AR')}`;
}

function getTimeAgo(days: number): string {
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
}

function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  if (score >= 60) return 'bg-amber-50 text-amber-600 border-amber-200';
  return 'bg-gray-50 text-gray-400 border-gray-200';
}

function getMatchScoreRing(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-gray-300';
}

function getTypeBadge(type: JobType): string {
  switch (type) {
    case 'Tiempo Completo':
      return 'bg-brand-sage/10 text-brand-sage border-brand-sage/20';
    case 'Medio Tiempo':
      return 'bg-sky-50 text-sky-600 border-sky-200';
    case 'Freelance':
      return 'bg-violet-50 text-violet-600 border-violet-200';
  }
}

function getModalityBadge(modality: Modality): string {
  switch (modality) {
    case 'Remoto':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Presencial':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Híbrido':
      return 'bg-indigo-50 text-indigo-600 border-indigo-200';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevancia');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedModality, selectedLocation, sortBy]);

  // ─── Active filter chips ───
  const activeFilters: { label: string; onRemove: () => void }[] = [];

  if (selectedType) {
    activeFilters.push({
      label: `Tipo: ${selectedType}`,
      onRemove: () => setSelectedType(''),
    });
  }
  if (selectedModality) {
    activeFilters.push({
      label: `Modalidad: ${selectedModality}`,
      onRemove: () => setSelectedModality(''),
    });
  }
  if (selectedLocation) {
    const loc = locationOptions.find((o) => o.value === selectedLocation);
    activeFilters.push({
      label: `Ubicación: ${loc?.label ?? selectedLocation}`,
      onRemove: () => setSelectedLocation(''),
    });
  }

  // ─── Filtering + Sorting ───
  const filteredOpportunities = useMemo(() => {
    const result = mockOpportunities.filter((job) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          job.company.toLowerCase().includes(q) ||
          job.position.toLowerCase().includes(q) ||
          job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }
      // Type
      if (selectedType && job.type !== selectedType) return false;
      // Modality
      if (selectedModality && job.modality !== selectedModality) return false;
      // Location
      if (selectedLocation && job.location !== selectedLocation) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'recientes':
        result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case 'salario':
        result.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      default: // relevancia
        result.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    return result;
  }, [searchQuery, selectedType, selectedModality, selectedLocation, sortBy]);

  // ─── Pagination ───
  const totalPages = Math.max(1, Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE));
  const paginatedJobs = filteredOpportunities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Render ───
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ──────── HEADER ──────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
          Marketplace de Talento
        </h1>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">
          Encontrá oportunidades que se ajusten a tu perfil
        </p>
      </motion.div>

      {/* ──────── SEARCH + FILTER BAR ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        {/* Search row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscá por empresa, puesto o skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-heading font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-brand-sage hover:text-brand-sage active:scale-95 transition-all duration-300 whitespace-nowrap',
              showFilters && 'border-brand-sage text-brand-sage bg-brand-bg/50',
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Collapsible filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Tipo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Tipo
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modalidad */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Modalidad
                  </label>
                  <select
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {modalityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ubicación */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Ubicación
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {locationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters row */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeFilters.map((f) => (
              <button
                key={f.label}
                onClick={f.onRemove}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-bg text-brand-heading text-xs font-bold rounded-full border border-brand-sage/20 hover:bg-brand-sage/10 transition-colors"
              >
                {f.label}
                <X className="w-3 h-3 text-gray-400 hover:text-brand-heading" />
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedType('');
                setSelectedModality('');
                setSelectedLocation('');
              }}
              className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-brand-sage transition-colors ml-1"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </motion.div>

      {/* ──────── RESULTS BAR ──────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          Mostrando {filteredOpportunities.length} oportunidad
          {filteredOpportunities.length !== 1 ? 'es' : ''}
        </p>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-brand-heading text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ──────── JOB CARDS GRID ──────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {paginatedJobs.map((job) => (
          <motion.div
            key={job.id}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
          >
            <div className="p-6 flex flex-col gap-4">
              {/* ── Header: Company + Match Score ── */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Company avatar placeholder */}
                  <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-brand-accent/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-brand-sage" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">
                      {job.company}
                    </p>
                    <h3 className="text-base font-black text-brand-heading leading-tight mt-0.5">
                      {job.position}
                    </h3>
                  </div>
                </div>

                {/* Match score badge — circular */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={cn(
                      'relative w-14 h-14 rounded-full flex items-center justify-center border-2 text-sm font-black',
                      getMatchScoreColor(job.matchScore),
                    )}
                  >
                    <span className={cn('text-xs font-black', getMatchScoreRing(job.matchScore))}>
                      {job.matchScore}%
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                    Match
                  </span>
                </div>
              </div>

              {/* ── Description ── */}
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                {job.description}
              </p>

              {/* ── Location + Salary ── */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
                </span>
              </div>

              {/* ── Type + Modality badges ── */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                    getTypeBadge(job.type),
                  )}
                >
                  <Briefcase className="w-3 h-3" />
                  {job.type}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                    getModalityBadge(job.modality),
                  )}
                >
                  {job.modality}
                </span>
              </div>

              {/* ── Skills ── */}
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-brand-bg text-brand-heading text-[11px] font-bold rounded-lg border border-brand-sage/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* ── Divider ── */}
              <div className="border-t border-gray-100" />

              {/* ── Footer: Posted date + CTA ── */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {getTimeAgo(job.postedDaysAgo)}
                </span>

                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-sage text-white text-xs font-bold rounded-xl hover:bg-brand-sage-hover active:scale-95 transition-all duration-300 group/btn">
                  Postularme
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ── Empty state ── */}
        {paginatedJobs.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={Search}
              title="Sin resultados"
              description="No encontramos oportunidades con esos filtros. Probá cambiando los criterios de búsqueda."
            />
          </div>
        )}
      </motion.div>

      {/* ──────── PAGINATION ──────── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-300',
              currentPage === 1
                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:border-brand-sage hover:text-brand-sage hover:bg-brand-bg/50',
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300',
                  currentPage === page
                    ? 'bg-brand-sage text-white shadow-md shadow-brand-sage/20'
                    : 'text-gray-500 hover:bg-brand-bg hover:text-brand-heading border border-transparent hover:border-brand-sage/20',
                )}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-300',
              currentPage === totalPages
                ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:border-brand-sage hover:text-brand-sage hover:bg-brand-bg/50',
            )}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
