import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp,
  ShieldCheck,
  Plus,
  BarChart3,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';

interface AdminMetrics {
  users: { total: number };
  events: { active: number };
}

export default function AdminDashboard() {
  const { user } = useAuth();

  // Mocks de métricas administrativas
  const [metrics] = useState<AdminMetrics>({
    users: { total: 124 },
    events: { active: 3 },
  });

  const stats = [
    { label: 'Total Usuarios', value: metrics.users.total, subtitle: 'Profesionales + Empresas', icon: Users, color: 'text-brand-sage', bg: 'bg-brand-sage/10' },
    { label: 'Registros Hoy', value: '+4', subtitle: 'Últimas 24 horas', icon: TrendingUp, color: 'text-brand-coral', bg: 'bg-brand-coral/10' },
    { label: 'Eventos Activos', value: metrics.events.active, subtitle: 'Próximos webinars', icon: Calendar, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
    { label: 'Validaciones', value: '3', subtitle: 'Perfiles por revisar', icon: ShieldCheck, color: 'text-brand-olive', bg: 'bg-brand-olive/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header — Hello, Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-brand-heading tracking-tight">
            Hola, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Panel de Control — Administración de la Red de Bienestar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/events">
            <button className="flex items-center gap-2 px-5 py-3 bg-brand-charcoal text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg text-sm">
              <Plus className="w-4 h-4 text-brand-sage" />
              Nuevo Evento
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ADMIN PHOTO CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 relative rounded-[2rem] overflow-hidden shadow-sm group min-h-[210px] max-w-[190px]"
        >
          <div className="absolute inset-0">
            <img 
              src="/default-professional.png"
              alt="Administrador"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-3 py-1.5 m-3 z-10 text-left rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="text-sm font-black text-white tracking-tight leading-tight">
              {user?.name || 'Administrador'}
            </h2>
            <p className="text-white/60 font-semibold text-[9px] uppercase tracking-wider">
              Administración
            </p>
          </div>
        </motion.div>

        {/* COMPACT STATS GRID */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group text-left"
            >
              <div className="flex items-center justify-between">
                <div className={cn('p-2.5 rounded-xl transition-transform group-hover:rotate-6 duration-300', stat.bg)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <MoreVertical className="w-4 h-4 text-gray-300" />
              </div>
              <div className="mt-4 space-y-0.5">
                <h3 className="text-2xl font-black text-brand-heading">
                  {stat.value}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-[9px] font-medium text-gray-500 leading-none opacity-60 mt-1">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-6 space-y-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-brand-charcoal" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Crecimiento</h2>
              <p className="text-[10px] text-gray-400 font-medium">Estadísticas mensuales de registros</p>
            </div>
          </div>
          <div className="h-48 bg-brand-bg/50 rounded-3xl flex items-center justify-center border-2 border-dashed border-brand-accent/30">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic opacity-50">[ Gráfico de Crecimiento ]</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 space-y-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-olive/10 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand-olive" />
              </div>
              <div className="text-left">
                <h2 className="text-base font-black text-brand-heading">Validaciones Pendientes</h2>
                <p className="text-[10px] text-gray-400 font-medium">Revisión de perfiles de empresas y talentos</p>
              </div>
            </div>
            <span className="bg-brand-card text-gray-500 rounded-full px-3 py-1 text-[9px] font-bold">3 pendientes</span>
          </div>
          
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-xs text-gray-400">
                    U{i}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-brand-heading">Usuario Registrado {i}</p>
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Profesional +45</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 text-[9px] font-black bg-white border border-gray-200 text-brand-heading uppercase tracking-widest rounded-lg hover:bg-brand-charcoal hover:text-white transition-all shadow-sm">Validar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
