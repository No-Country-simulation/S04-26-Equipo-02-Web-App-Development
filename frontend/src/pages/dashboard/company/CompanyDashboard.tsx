import { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, Search, Camera, Star, ArrowRight, UserCheck, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getMyOffers, type Offer } from '../../../api/hiring';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface GlobalApplication {
  id: string;
  offerId: string;
  offerTitle: string;
  companyId: string;
  professionalId: string;
  professionalName: string;
  professionalEmail: string;
  professionalTitle: string;
  status: 'INTERESTED' | 'CONTACTED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED';
  createdAt: string;
}

const STATUS_LABELS: Record<GlobalApplication['status'], string> = {
  INTERESTED:   'Interesado',
  CONTACTED:    'Contactado',
  INTERVIEWING: 'Entrevistando',
  HIRED:        'Contratado',
  REJECTED:     'Rechazado',
};

const STATUS_NEXT: Partial<Record<GlobalApplication['status'], GlobalApplication['status']>> = {
  INTERESTED:   'CONTACTED',
  CONTACTED:    'INTERVIEWING',
  INTERVIEWING: 'HIRED',
};

const STATUS_COLORS: Record<GlobalApplication['status'], string> = {
  INTERESTED:   'bg-brand-sage/10 text-brand-sage border-brand-sage/20',
  CONTACTED:    'bg-blue-50 text-blue-600 border-blue-200',
  INTERVIEWING: 'bg-amber-50 text-amber-600 border-amber-200',
  HIRED:        'bg-emerald-50 text-emerald-600 border-emerald-200',
  REJECTED:     'bg-red-50 text-red-500 border-red-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// ── Helper: load & save global applications ───────────────────────────────────

function loadGlobalApps(): GlobalApplication[] {
  try {
    const raw = localStorage.getItem('global_job_applications');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGlobalApps(apps: GlobalApplication[]) {
  localStorage.setItem('global_job_applications', JSON.stringify(apps));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<GlobalApplication[]>([]);

  // Load company offers + filter applicants for this company
  useEffect(() => {
    getMyOffers()
      .then((data) => {
        setOffers(data);
        const offerIds = new Set(data.map((o) => o.id));
        const all = loadGlobalApps();
        const mine = all.filter((a) => offerIds.has(a.offerId));
        setApplications(mine);
      })
      .catch(() => {
        // silently fallback — company may have no offers yet
        const all = loadGlobalApps();
        setApplications(all);
      });
  }, []);

  const advanceStatus = (appId: string) => {
    const all = loadGlobalApps();
    const updated = all.map((a) => {
      if (a.id !== appId) return a;
      const next = STATUS_NEXT[a.status];
      return next ? { ...a, status: next } : a;
    });
    saveGlobalApps(updated);
    const offerIds = new Set(offers.map((o) => o.id));
    setApplications(updated.filter((a) => offerIds.has(a.offerId)));
  };

  const rejectApp = (appId: string) => {
    const all = loadGlobalApps();
    const updated = all.map((a) =>
      a.id === appId ? { ...a, status: 'REJECTED' as const } : a
    );
    saveGlobalApps(updated);
    const offerIds = new Set(offers.map((o) => o.id));
    setApplications(updated.filter((a) => offerIds.has(a.offerId)));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Hola, {user?.name?.split(' ')[0] || 'Empresa'}
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Panel de Empresa — Encuentra Talento Senior Calificado
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-brand-card p-2.5 rounded-2xl px-5 border border-brand-accent/30">
            <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
            <span className="font-bold text-brand-heading">Empresa Verificada</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* HERO IMAGE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-lg group min-h-[320px]"
        >
          <div className="absolute inset-0">
            <img
              src="/default-company.png"
              alt="Empresa"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <Link to="/dashboard/profile" className="absolute top-4 right-4 z-20 p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-white/30 transition-all">
            <Camera className="w-5 h-5" />
          </Link>

          <div className="absolute bottom-5 left-0 right-0 px-4 py-1.5 m-4 z-10 text-left rounded-2xl bg-white/30 backdrop-blur-xl border border-white/10">
            <h2 className="text-2xl font-black text-black/80 tracking-tight leading-tight">
              {user?.name || 'Mi Empresa'}
            </h2>
            <p className="text-black/70 font-bold text-[10px] uppercase tracking-wider mt-1">
              Perfil Corporativo
            </p>
          </div>
        </motion.div>

        {/* METRICS & QUICK ACTIONS */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-bg rounded-xl">
                  <Users className="w-6 h-6 text-brand-sage" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-brand-heading">{applications.length}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Postulantes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-bg rounded-xl">
                  <FileText className="w-6 h-6 text-brand-olive" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-brand-heading">{offers.length}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Vacantes Activas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-bg rounded-xl">
                  <TrendingUp className="w-6 h-6 text-brand-gold" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-brand-heading">
                {applications.filter(a => a.status === 'INTERESTED' || a.status === 'CONTACTED').length}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">En Proceso</p>
            </motion.div>
          </div>

          {/* Search Talent CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Search className="w-48 h-48" />
            </div>
            <div className="space-y-3 z-10 text-left">
              <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-brand-sage" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">¿Buscas talento con experiencia?</h3>
              <p className="text-gray-500 font-semibold max-w-md">Explorá el Marketplace de candidatos 45+ y encontrá profesionales con la trayectoria que tu equipo necesita.</p>
            </div>
            <div className="z-10 shrink-0 w-full md:w-auto">
              <Link to="/dashboard/talent-search">
                <button className="w-full md:w-auto bg-brand-sage hover:bg-brand-sage-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-brand-sage/25 flex items-center justify-center gap-2 active:scale-95">
                  Buscar Talento <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── APPLICANTS SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-bg rounded-xl">
              <UserCheck className="w-5 h-5 text-brand-sage" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-heading">Postulantes a mis Vacantes</h2>
              <p className="text-xs text-gray-400 font-medium">
                {applications.length === 0 ? 'Sin postulaciones aún' : `${applications.length} candidato${applications.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-400 font-semibold text-sm">
              Aún no hay postulantes. Cuando un profesional se postule a tus vacantes, aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {applications.map((app) => (
              <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-brand-bg border border-brand-sage/20 flex items-center justify-center shrink-0 text-brand-sage font-black text-lg">
                  {app.professionalName.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-brand-heading text-sm">{app.professionalName}</p>
                    <span className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                      STATUS_COLORS[app.status]
                    )}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{app.offerTitle}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {formatDate(app.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/dashboard/talent-search`}>
                    <button className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-brand-sage hover:text-brand-sage transition-all">
                      Ver Perfil
                    </button>
                  </Link>

                  {app.status !== 'HIRED' && app.status !== 'REJECTED' && STATUS_NEXT[app.status] && (
                    <button
                      onClick={() => advanceStatus(app.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-sage text-white hover:bg-brand-sage/90 active:scale-95 transition-all flex items-center gap-1"
                    >
                      {STATUS_LABELS[STATUS_NEXT[app.status]!]} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  {app.status !== 'REJECTED' && app.status !== 'HIRED' && (
                    <button
                      onClick={() => rejectApp(app.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                    >
                      Rechazar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
