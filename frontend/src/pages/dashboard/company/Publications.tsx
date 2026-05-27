import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Plus,
  Search,
  Briefcase,
  Building2,
  FileText,
  DollarSign,
  Clock,
  Edit3,
  Trash2,
  X,
  Loader2,
  GraduationCap,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import {
  getMyOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  type Offer,
  type CreateOfferPayload,
  type UpdateOfferPayload,
} from '../../../api/hiring';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

// ─── Offer Form Modal ─────────────────────────────────────────────────────────

interface OfferFormState {
  title: string;
  salaryRange: string;
  contractType: string;
  modality: string;
  description: string;
  education: string;
  experience: string;
}

const EMPTY_FORM: OfferFormState = {
  title: '',
  salaryRange: '',
  contractType: 'Término indefinido',
  modality: 'Remoto',
  description: '',
  education: '',
  experience: '',
};

function OfferFormModal({
  open,
  onClose,
  onSaved,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initial?: Offer | null;
}) {
  const [form, setForm] = useState<OfferFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        salaryRange: initial.salaryRange,
        contractType: initial.contractType,
        modality: initial.modality,
        description: initial.description,
        education: initial.education,
        experience: initial.experience,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial, open]);

  if (!open) return null;

  const isEditing = !!initial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.salaryRange) {
      toast.error('El título y el rango salarial son obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (isEditing && initial) {
        const payload: UpdateOfferPayload = { id: initial.id, ...form };
        await updateOffer(payload);
        toast.success('Oferta actualizada correctamente');
      } else {
        const payload: CreateOfferPayload = form;
        await createOffer(payload);
        toast.success('Oferta creada correctamente');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setSaving(false);
  };

  const field = (key: keyof OfferFormState, label: string, opts?: { type?: string; placeholder?: string; textarea?: boolean }) => (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-gray-700">{label}</Label>
      {opts?.textarea ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          placeholder={opts.placeholder}
          rows={3}
          className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage resize-none"
        />
      ) : opts?.type === 'select' ? (
        <select
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage"
        >
          {opts.placeholder?.split(',').map((opt) => (
            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
          ))}
        </select>
      ) : (
        <Input
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          className="rounded-2xl border-gray-200"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-lg mx-4 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-brand-heading">
            {isEditing ? 'Editar Oferta' : 'Nueva Publicación'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {field('title', 'Título *', { placeholder: 'Ej: Desarrollador Full Stack Node.js' })}
          {field('salaryRange', 'Rango Salarial *', { placeholder: 'Ej: $1500 - $2000 USD' })}

          <div className="grid grid-cols-2 gap-4">
            {field('contractType', 'Tipo de Contrato', {
              type: 'select',
              placeholder: 'Término indefinido,Freelance',
            })}
            {field('modality', 'Modalidad', {
              type: 'select',
              placeholder: 'Remoto,Híbrido,Presencial',
            })}
          </div>

          {field('description', 'Descripción', { placeholder: 'Describí los detalles de la posición...', textarea: true })}
          {field('education', 'Formación Requerida', { placeholder: 'Ej: Grado universitario o equivalente' })}
          {field('experience', 'Experiencia Requerida', { placeholder: 'Ej: Más de 3 años de experiencia' })}

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
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Crear Oferta'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Publications() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Offer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyOffers();
      setOffers(data);
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const filtered = offers.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.contractType.toLowerCase().includes(q) ||
      o.modality.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q)
    );
  });

  const handleSaveOffer = () => {
    loadOffers();
  };

  const handleDeleteOffer = async (offer: Offer) => {
    setDeletingId(offer.id);
    try {
      await deleteOffer(offer.id);
      toast.success('Oferta eliminada correctamente');
      loadOffers();
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Publicaciones — ${user.name}` : 'Mis Publicaciones'}
        description="Gestioná tus ofertas laborales activas en Red de Bienestar Laboral."
      />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Mis Publicaciones
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Gestioná tus ofertas laborales activas
          </p>
        </div>
        <button
          onClick={() => { setEditingOffer(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-brand-sage hover:bg-brand-sage-hover text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-brand-sage/25 active:scale-95 text-sm"
        >
          <Plus className="w-5 h-5" />
          Nueva Publicación
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: 'Total Publicaciones', value: offers.length, icon: FileText, color: 'text-brand-sage', bg: 'bg-brand-bg' },
          { label: 'Vacantes Remotas', value: offers.filter((o) => o.modality === 'Remoto').length, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Término Indefinido', value: offers.filter((o) => o.contractType === 'Término indefinido').length, icon: Briefcase, color: 'text-brand-gold', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
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

      {/* ── Search ── */}
      <div className="flex items-center gap-2 w-full md:w-80">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar publicaciones..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 placeholder:text-gray-400 focus:border-brand-sage focus:ring-2 focus:ring-brand-sage/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-sage" />
        </div>
      )}

      {/* ── Offer Cards ── */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={searchQuery ? undefined : FileText}
          title={searchQuery ? 'Sin resultados' : 'No hay publicaciones'}
          description={
            searchQuery
              ? 'Ninguna publicación coincide con tu búsqueda.'
              : 'Creá tu primera oferta laboral para empezar a recibir postulaciones.'
          }
        />
      )}

      {!loading && filtered.length > 0 && (
        <motion.div
          key={searchQuery}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {filtered.map((offer) => (
            <motion.div
              key={offer.id}
              variants={cardVariants}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left content */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Title */}
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-black text-brand-heading tracking-tight">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Meta row: modality + contract */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border',
                        getModalityBadge(offer.modality),
                      )}
                    >
                      {offer.modality}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-brand-bg text-brand-heading border-brand-sage/20">
                      <Briefcase className="w-3 h-3" />
                      {offer.contractType}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-brand-bg text-brand-heading border-brand-sage/20">
                      <DollarSign className="w-3 h-3" />
                      {offer.salaryRange || 'A convenir'}
                    </span>
                  </div>

                  {/* Description */}
                  {offer.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  {/* Experience + Education */}
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                    {offer.experience && (
                      <span className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        {offer.experience}
                      </span>
                    )}
                    {offer.education && (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {offer.education}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    Creada {formatDate(offer.createdAt)}
                    {offer.updatedAt !== offer.createdAt && (
                      <> · Actualizada {formatDate(offer.updatedAt)}</>
                    )}
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingOffer(offer); setShowForm(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-brand-sage hover:text-brand-sage text-gray-600 text-xs font-bold transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(offer)}
                    disabled={deletingId === offer.id}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 rounded-xl hover:bg-red-50 text-red-500 text-xs font-bold transition-all"
                  >
                    {deletingId === offer.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Create / Edit Form Modal ── */}
      <OfferFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingOffer(null); }}
        onSaved={handleSaveOffer}
        initial={editingOffer}
      />

      {/* ── Delete Confirm ── */}
      {confirmDelete && (
        <ConfirmDialog
          open={!!confirmDelete}
          title="Eliminar oferta"
          message={`¿Estás seguro de eliminar "${confirmDelete.title}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          onConfirm={() => handleDeleteOffer(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
