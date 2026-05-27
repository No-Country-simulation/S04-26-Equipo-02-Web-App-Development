import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Search,
  DollarSign,
  Briefcase,
  Clock,
  SlidersHorizontal,
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import {
  getOpportunities,
  type Offer,
} from '../../../api/hiring';

// ─── Mock company names ──────────────────────────────────────────────────────
// Backend devuelve companyId (UUID), mapeamos a nombres para la UI
const mockCompanyNames: Record<string, string> = {
  'default': 'Empresa',
};
let companyNameCounter = 1;

function getCompanyName(companyId: string): string {
  if (mockCompanyNames[companyId]) return mockCompanyNames[companyId];
  const names = [
    'TechSolutions AR', 'InnovaTech', 'DataWise Consulting', 'EcoSoluciones',
    'DevRemote LATAM', 'Grupo Nexo', 'CloudBase SRL', 'Agencia Crear',
    'Fintech Pro', 'BioHealth Labs', 'GreenSoft', 'Horizon Media',
  ];
  const name = names[companyNameCounter % names.length];
  mockCompanyNames[companyId] = name;
  companyNameCounter++;
  return name;
}

// ─── Filter & Sort Options ────────────────────────────────────────────────────

const contractTypeOptions = [
  { value: '', label: 'Todos' },
  { value: 'Término indefinido', label: 'Término indefinido' },
  { value: 'Freelance', label: 'Freelance' },
] as const;

const modalityOptions = [
  { value: '', label: 'Todas' },
  { value: 'Remoto', label: 'Remoto' },
  { value: 'Presencial', label: 'Presencial' },
  { value: 'Híbrido', label: 'Híbrido' },
] as const;

const sortOptions = [
  { value: 'updatedAt', label: 'Más recientes' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getContractBadge(type: string): string {
  switch (type) {
    case 'Término indefinido':
      return 'bg-brand-sage/10 text-brand-sage border-brand-sage/20';
    case 'Freelance':
      return 'bg-violet-50 text-violet-600 border-violet-200';
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

function getModalityBadge(modality: string): string {
  switch (modality) {
    case 'Remoto':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Presencial':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'Híbrido':
      return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

export default function Opportunities() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // ─── Fetch data ───
  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (searchQuery) filters.title = searchQuery;
      if (selectedType) filters.contractType = selectedType;
      if (selectedModality) filters.modality = selectedModality;
      if (sortBy) filters.orderBy = sortBy;

      const data = await getOpportunities(filters);
      setOffers(data);
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setLoading(false);
  }, [searchQuery, selectedType, selectedModality, sortBy]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedModality, sortBy]);

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

  // ─── Pagination ───
  const totalPages = Math.max(1, Math.ceil(offers.length / ITEMS_PER_PAGE));
  const paginatedOffers = offers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Render ───
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Oportunidades — ${user.name}` : 'Marketplace de Talento'}
        description="Encontrá oportunidades laborales que se ajusten a tu perfil profesional en Red de Bienestar Laboral."
      />

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
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscá por puesto o skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-heading font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all"
            />
          </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Tipo de contrato
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {contractTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

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
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Cargando...
            </span>
          ) : (
            <>Mostrando {offers.length} oportunidad{offers.length !== 1 ? 'es' : ''}</>
          )}
        </p>

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

      {/* ──────── LOADING ──────── */}
      {loading && (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-sage" />
        </div>
      )}

      {/* ──────── OFFER CARDS GRID ──────── */}
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
          {paginatedOffers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="p-6 flex flex-col gap-4">
                {/* ── Header: Company ── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-brand-accent/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-brand-sage" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">
                        {getCompanyName(offer.companyId)}
                      </p>
                      <h3 className="text-base font-black text-brand-heading leading-tight mt-0.5">
                        {offer.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* ── Description ── */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {offer.description}
                </p>

                {/* ── Salary ── */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    {offer.salaryRange || 'A convenir'}
                  </span>
                </div>

                {/* ── Contract + Modality badges ── */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                      getContractBadge(offer.contractType),
                    )}
                  >
                    <Briefcase className="w-3 h-3" />
                    {offer.contractType}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                      getModalityBadge(offer.modality),
                    )}
                  >
                    {offer.modality}
                  </span>
                </div>

                {/* ── Experience + Education ── */}
                <div className="space-y-1">
                  {offer.experience && (
                    <span className="text-[11px] font-semibold text-gray-400">
                      Experiencia: {offer.experience}
                    </span>
                  )}
                  {offer.education && (
                    <span className="text-[11px] font-semibold text-gray-400 block">
                      Formación: {offer.education}
                    </span>
                  )}
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-gray-100" />

                {/* ── Footer: Updated date ── */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    Actualizado {formatDate(offer.updatedAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Empty state ── */}
          {paginatedOffers.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description="No encontramos oportunidades con esos filtros. Probá cambiando los criterios de búsqueda."
              />
            </div>
          )}
        </motion.div>
      )}

      {/* ──────── PAGINATION ──────── */}
      {totalPages > 1 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
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
