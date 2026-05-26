import { Users, FileText, TrendingUp, Search, Camera, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CompanyDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
            Hola, {user?.name?.split(' ')[0] || 'Empresa'}
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Panel de Empresa - Encuentra Talento Senior Calificado
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
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/default-company.png"
              alt="Empresa"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <Link to="/dashboard/profile" className="absolute top-4 right-4 z-20 p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-white/30 transition-all">
            <Camera className="w-5 h-5" />
          </Link>

          {/* Name Overlay */}
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
              <h3 className="text-4xl font-black text-brand-heading">12</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Candidatos Vistos</p>
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
              <h3 className="text-4xl font-black text-brand-heading">2</h3>
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
              <h3 className="text-4xl font-black text-brand-heading">5</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Matches Sugeridos</p>
            </motion.div>
          </div>

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
              <p className="text-gray-500 font-semibold max-w-md">Explora el Marketplace de candidatos 45+ y encuentra profesionales con la trayectoria y sabiduría que tu equipo necesita.</p>
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
    </div>
  );
}
