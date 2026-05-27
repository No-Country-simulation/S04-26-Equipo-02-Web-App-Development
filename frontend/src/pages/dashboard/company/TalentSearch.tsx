import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Search,
  MapPin,
  X,
  Filter,
  Briefcase,
  Star,
  ChevronDown,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import {
  searchCandidates,
  preselectCandidate,
  type CandidateSearchResult,
} from '../../../api/hiring';

// ─── Mock user names ──────────────────────────────────────────────────────────
// Backend devuelve userId (UUID), mapeamos a nombres para la UI
const mockNames: string[] = [
  'Ricardo Méndez', 'Silvia Gallardo', 'Horacio Páez', 'Marcela Insúa',
  'Carlos Ferreyra', 'Adriana Benítez', 'Gabriel Montenegro', 'Liliana Roldán',
  'Patricio Lagos', 'Valentina Suárez', 'Fernando Castro', 'Roxana Gil',
  'Héctor Morales', 'Graciela Paz', 'Sergio Aguirre',
];

const mockNameIndex: Record<string, string> = {};
let nameCounter = 0;

function getCandidateName(userId: string): string {
  if (mockNameIndex[userId]) return mockNameIndex[userId];
  const name = mockNames[nameCounter % mockNames.length];
  mockNameIndex[userId] = name;
  nameCounter++;
  return name;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const availabilityMap: Record<string, string> = {
  IMMEDIATE: 'Disponible',
  NOTICE: 'En proceso',
  OPEN_TO_OFFERS: 'Abierto a propuestas',
};

const modalityMap: Record<string, string> = {
  REMOTE: 'Remoto',
  ONSITE: 'Presencial',
  HYBRID: 'Híbrido',
};

function getAvailabilityColor(avail: string): string {
  switch (avail) {
    case 'IMMEDIATE':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'NOTICE':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

function getAvailabilityDot(avail: string): string {
  switch (avail) {
    case 'IMMEDIATE':
      return 'bg-emerald-400';
    case 'NOTICE':
      return 'bg-amber-400';
    default:
      return 'bg-gray-300';
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (score >= 60) return 'bg-amber-50 text-amber-600 border-amber-100';
  return 'bg-gray-50 text-gray-500 border-gray-200';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
}

const locationOptions = [
  { value: '', label: 'Todas las ubicaciones' },
  { value: 'Buenos Aires', label: 'Buenos Aires' },
  { value: 'CABA', label: 'CABA' },
  { value: 'Córdoba', label: 'Córdoba' },
  { value: 'Rosario', label: 'Rosario' },
  { value: 'Mendoza', label: 'Mendoza' },
] as const;

const availabilityOptions = [
  { value: '', label: 'Cualquier disponibilidad' },
  { value: 'IMMEDIATE', label: 'Disponible' },
  { value: 'NOTICE', label: 'En proceso' },
  { value: 'OPEN_TO_OFFERS', label: 'Abierto a propuestas' },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function TalentSearch() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<CandidateSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [preselectingId, setPreselectingId] = useState<string | null>(null);
  const [preselectedIds, setPreselectedIds] = useState<Set<string>>(new Set());

  // ─── Fetch candidates ───
  const loadCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string | number | string[]> = {};
      if (searchQuery) filters.professionalTitle = searchQuery;
      if (selectedLocation) filters.location = selectedLocation;
      if (selectedAvailability) filters.availability = selectedAvailability;

      const data = await searchCandidates(filters);
      setCandidates(data);
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setLoading(false);
  }, [searchQuery, selectedLocation, selectedAvailability]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // ─── Preselection ───
  const handlePreselect = async (userId: string) => {
    setPreselectingId(userId);
    try {
      await preselectCandidate({ userId, notes: '' });
      toast.success('Candidato preseleccionado');
      setPreselectedIds((prev) => new Set(prev).add(userId));
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setPreselectingId(null);
  };

  // ─── Active filter chips ───
  const activeFilters: { label: string; onRemove: () => void }[] = [];

  if (selectedLocation) {
    activeFilters.push({
      label: `Ubicación: ${selectedLocation}`,
      onRemove: () => setSelectedLocation(''),
    });
  }
  if (selectedAvailability) {
    activeFilters.push({
      label: `Disponibilidad: ${availabilityOptions.find((o) => o.value === selectedAvailability)?.label ?? selectedAvailability}`,
      onRemove: () => setSelectedAvailability(''),
    });
  }

  // ─── Filter open flag ───
  const filtersOpen = showFilters;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Buscar Talento — ${user.name}` : 'Buscar Talento'}
        description="Encontrá profesionales con experiencia validada en Red de Bienestar Laboral."
      />

      {/* ──────── HEADER ──────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
          Buscar Talento
        </h1>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">
          Encontrá profesionales con experiencia y trayectoria
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
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscá por cargo o skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-heading font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all"
            />
          </div>
          <button
            onClick={() => loadCandidates()}
            className="inline-flex items-center justify-center gap-2 bg-brand-sage hover:bg-brand-sage-hover text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-brand-sage/25 active:scale-95 text-sm"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-brand-sage hover:text-brand-sage active:scale-95 transition-all duration-300 whitespace-nowrap',
              filtersOpen && 'border-brand-sage text-brand-sage bg-brand-bg/50'
            )}
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-300',
                filtersOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Collapsible filter chips */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Disponibilidad
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {availabilityOptions.map((opt) => (
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
                setSelectedLocation('');
                setSelectedAvailability('');
              }}
              className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-brand-sage transition-colors ml-1"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </motion.div>

      {/* ──────── RESULTS COUNT ──────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-bold text-gray-400 uppercase tracking-wider"
      >
        {loading
          ? 'Buscando...'
          : `Mostrando ${candidates.length} profesional${candidates.length !== 1 ? 'es' : ''}`
        }
      </motion.p>

      {/* ──────── LOADING ──────── */}
      {loading && (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-sage" />
        </div>
      )}

      {/* ──────── PROFESSIONAL CARDS GRID ──────── */}
      {!loading && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {candidates.map((candidate) => {
            const name = getCandidateName(candidate.userId);
            const initials = getInitials(name);
            const isPreselected = preselectedIds.has(candidate.userId);

            return (
              <motion.div
                key={candidate.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="p-6 flex flex-col gap-4">
                  {/* Avatar + Name row */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-brand-bg flex items-center justify-center shrink-0 text-sm font-black text-brand-sage">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-brand-heading truncate">
                        {name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 truncate">
                        {candidate.professionalTitle}
                      </p>
                    </div>

                    {/* Score badge */}
                    <div
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0',
                        getScoreColor(candidate.completionScore)
                      )}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {candidate.completionScore}%
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {candidate.location || 'Sin especificar'}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((s) => (
                      <span
                        key={s.skill.name}
                        className="px-2.5 py-1 bg-brand-bg text-brand-heading text-[11px] font-bold rounded-lg border border-brand-sage/10"
                      >
                        {s.skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Experience + Availability */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <Briefcase className="w-3.5 h-3.5" />
                      {candidate.yearsOfExperience} años de exp.
                    </div>

                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                        getAvailabilityColor(candidate.availability)
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          getAvailabilityDot(candidate.availability)
                        )}
                      />
                      {availabilityMap[candidate.availability] || candidate.availability}
                    </span>
                  </div>

                  {/* Modality + Salary */}
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400">
                    {candidate.preferredModality && (
                      <span>
                        Modalidad: {modalityMap[candidate.preferredModality] || candidate.preferredModality}
                      </span>
                    )}
                    {candidate.salaryExpectation && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>Expectativa: {candidate.salaryExpectation}</span>
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Action */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handlePreselect(candidate.userId)}
                      disabled={preselectingId === candidate.userId || isPreselected}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-bold transition-all rounded-xl px-4 py-2',
                        isPreselected
                          ? 'bg-brand-bg text-brand-sage border border-brand-sage/20 cursor-default'
                          : 'bg-brand-sage text-white hover:bg-brand-sage-hover shadow-sm shadow-brand-sage/20',
                      )}
                    >
                      {preselectingId === candidate.userId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isPreselected ? (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Preseleccionado
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Preseleccionar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Empty state */}
          {candidates.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-black text-brand-heading mb-1">
                Sin resultados
              </h3>
              <p className="text-sm text-gray-400 font-semibold max-w-xs">
                No encontramos profesionales con esos filtros. Probá cambiando los criterios de búsqueda.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
