import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Users,
  Briefcase,
  Building2,
  Calendar,
  UserPlus,
  FileCheck,
  Sparkles,
  Clock,
  Activity,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* ───────────────────────────────────────────
   Mock data
   ─────────────────────────────────────────── */

const growthData = [
  { mes: 'Jun', profesionales: 320, empresas: 85 },
  { mes: 'Jul', profesionales: 380, empresas: 95 },
  { mes: 'Ago', profesionales: 420, empresas: 110 },
  { mes: 'Sep', profesionales: 490, empresas: 130 },
  { mes: 'Oct', profesionales: 530, empresas: 150 },
  { mes: 'Nov', profesionales: 580, empresas: 170 },
  { mes: 'Dic', profesionales: 620, empresas: 185 },
  { mes: 'Ene', profesionales: 680, empresas: 210 },
  { mes: 'Feb', profesionales: 730, empresas: 235 },
  { mes: 'Mar', profesionales: 790, empresas: 260 },
  { mes: 'Abr', profesionales: 840, empresas: 285 },
  { mes: 'May', profesionales: 892, empresas: 312 },
];

const roleDistribution = [
  { name: 'Profesionales', value: 892, color: 'var(--color-brand-sage)' },
  { name: 'Empresas', value: 312, color: 'var(--color-brand-gold)' },
  { name: 'Administradores', value: 43, color: 'var(--color-brand-coral)' },
];

const activityData = [
  { mes: 'Ene', eventos: 5, postulaciones: 38, perfiles: 52 },
  { mes: 'Feb', eventos: 4, postulaciones: 42, perfiles: 48 },
  { mes: 'Mar', eventos: 6, postulaciones: 55, perfiles: 61 },
  { mes: 'Abr', eventos: 3, postulaciones: 47, perfiles: 55 },
  { mes: 'May', eventos: 7, postulaciones: 63, perfiles: 72 },
];

const topSkills = [
  { nombre: 'Bienestar Laboral', count: 187 },
  { nombre: 'Coaching', count: 154 },
  { nombre: 'Psicología', count: 132 },
  { nombre: 'Gestión de Equipos', count: 118 },
  { nombre: 'Liderazgo', count: 96 },
  { nombre: 'Meditación', count: 84 },
  { nombre: 'Nutrición', count: 71 },
  { nombre: 'Yoga', count: 59 },
];

const recentActivity = [
  {
    id: 1,
    type: 'register',
    user: 'María García',
    action: 'se registró como Profesional',
    time: 'Hace 12 min',
    icon: UserPlus,
    color: 'text-brand-sage',
    bg: 'bg-brand-sage/10',
  },
  {
    id: 2,
    type: 'profile',
    user: 'Carlos López',
    action: 'completó su perfil profesional',
    time: 'Hace 28 min',
    icon: FileCheck,
    color: 'text-brand-olive',
    bg: 'bg-brand-olive/10',
  },
  {
    id: 3,
    type: 'event',
    user: 'Bienestar Corp',
    action: 'creó un nuevo evento — "Webinar: Salud Mental"',
    time: 'Hace 1 h',
    icon: Calendar,
    color: 'text-brand-gold',
    bg: 'bg-brand-gold/10',
  },
  {
    id: 4,
    type: 'skill',
    user: 'Ana Martínez',
    action: 'agregó 3 nuevas habilidades',
    time: 'Hace 2 h',
    icon: Sparkles,
    color: 'text-brand-sage',
    bg: 'bg-brand-sage/10',
  },
  {
    id: 5,
    type: 'register',
    user: 'Grupo Álamo',
    action: 'se registró como Empresa',
    time: 'Hace 3 h',
    icon: Building2,
    color: 'text-brand-gold',
    bg: 'bg-brand-gold/10',
  },
  {
    id: 6,
    type: 'profile',
    user: 'Diego Fernández',
    action: 'actualizó su experiencia laboral',
    time: 'Hace 4 h',
    icon: FileCheck,
    color: 'text-brand-olive',
    bg: 'bg-brand-olive/10',
  },
  {
    id: 7,
    type: 'event',
    user: 'Mindfulness SA',
    action: 'publicó 2 nuevas vacantes',
    time: 'Hace 5 h',
    icon: Briefcase,
    color: 'text-brand-coral',
    bg: 'bg-brand-coral/10',
  },
];

const periods = ['Últimos 7 días', 'Último mes', 'Último trimestre', 'Último año'] as const;

type Period = (typeof periods)[number];

/* ───────────────────────────────────────────
   Custom tooltip
   ─────────────────────────────────────────── */

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill?: string; color?: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-xl text-sm space-y-1">
      <p className="font-bold text-brand-heading text-xs">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-xs font-medium">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          {entry.name}: <span className="font-black text-brand-heading">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────
   Main component
   ─────────────────────────────────────────── */

export default function Metrics() {
  const { user } = useAuth();
  const [activePeriod, setActivePeriod] = useState<Period>('Último mes');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Métricas — ${user.name}` : 'Métricas y Analíticas'}
        description="Panel de análisis y estadísticas de la plataforma Red de Bienestar Laboral."
      />
      {/* ═══ Header ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-brand-heading tracking-tight">
            Métricas y Analíticas
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Panel de análisis y estadísticas de la plataforma
          </p>
        </div>
      </div>

      {/* ═══ Period Selector ═══ */}
      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300',
              activePeriod === period
                ? 'bg-brand-charcoal text-white shadow-lg'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-brand-sage/40 hover:text-brand-sage hover:shadow-sm'
            )}
          >
            {period}
          </button>
        ))}
      </div>

      {/* ═══ Row 1 — KPI Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Usuarios Totales',
            value: '1,247',
            change: '↑12%',
            changeColor: 'text-brand-sage',
            icon: Users,
            color: 'text-brand-sage',
            bg: 'bg-brand-sage/10',
          },
          {
            label: 'Profesionales Registrados',
            value: '892',
            change: '↑8%',
            changeColor: 'text-brand-sage',
            icon: Briefcase,
            color: 'text-brand-olive',
            bg: 'bg-brand-olive/10',
          },
          {
            label: 'Empresas Activas',
            value: '312',
            change: '↑15%',
            changeColor: 'text-brand-sage',
            icon: Building2,
            color: 'text-brand-gold',
            bg: 'bg-brand-gold/10',
          },
          {
            label: 'Eventos Realizados',
            value: '48',
            change: '↓3%',
            changeColor: 'text-brand-coral',
            icon: Calendar,
            color: 'text-brand-coral',
            bg: 'bg-brand-coral/10',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  'p-2.5 rounded-xl transition-transform group-hover:rotate-6 duration-300',
                  stat.bg
                )}
              >
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-brand-heading">{stat.value}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide mt-1',
                  stat.changeColor
                )}
              >
                {stat.change} vs mes anterior
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ Row 2 — AreaChart + PieChart ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Growth — AreaChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-sage/10 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-brand-sage" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Crecimiento de Usuarios</h2>
              <p className="text-[10px] text-gray-400 font-medium">Evolución mensual de registros</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-sage)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-brand-sage)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="growthGradientEmpresas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-gold)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-brand-gold)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="profesionales"
                  stroke="var(--color-brand-sage)"
                  strokeWidth={2.5}
                  fill="url(#growthGradient)"
                  name="Profesionales"
                />
                <Area
                  type="monotone"
                  dataKey="empresas"
                  stroke="var(--color-brand-gold)"
                  strokeWidth={2.5}
                  fill="url(#growthGradientEmpresas)"
                  name="Empresas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribution — PieChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Distribución por Rol</h2>
              <p className="text-[10px] text-gray-400 font-medium">Composición de la plataforma</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {roleDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ Row 3 — BarChart + Horizontal BarChart ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity — BarChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-olive/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-brand-olive" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Actividad Mensual</h2>
              <p className="text-[10px] text-gray-400 font-medium">
                Eventos, postulaciones y perfiles completados
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="eventos"
                  fill="var(--color-brand-sage)"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  name="Eventos"
                />
                <Bar
                  dataKey="postulaciones"
                  fill="var(--color-brand-gold)"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  name="Postulaciones"
                />
                <Bar
                  dataKey="perfiles"
                  fill="var(--color-brand-coral)"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  name="Perfiles"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Inline legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[
              { label: 'Eventos', color: 'var(--color-brand-sage)' },
              { label: 'Postulaciones', color: 'var(--color-brand-gold)' },
              { label: 'Perfiles', color: 'var(--color-brand-coral)' },
            ].map((entry) => (
              <div key={entry.label} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {entry.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Skills — Horizontal BarChart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-coral/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-coral" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Top Habilidades</h2>
              <p className="text-[10px] text-gray-400 font-medium">
                Habilidades más registradas por profesionales
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSkills}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Profesionales"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                >
                  {topSkills.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index === 0
                          ? 'var(--color-brand-sage)'
                          : index === 1
                            ? 'var(--color-brand-olive)'
                            : index === 2
                              ? 'var(--color-brand-gold)'
                              : index === 3
                                ? 'var(--color-brand-coral)'
                                : 'var(--color-brand-accent)'
                      }
                      fillOpacity={1 - index * 0.06}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ═══ Row 4 — Activity Feed + Connected Users ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-sage/10 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-sage" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Actividad Reciente</h2>
              <p className="text-[10px] text-gray-400 font-medium">
                Últimos movimientos en la plataforma
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scroll-smooth">
            {recentActivity.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.id * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-bg/30 transition-all duration-200 group cursor-default"
              >
                <div className={cn('p-2 rounded-xl shrink-0', item.bg)}>
                  <item.icon className={cn('w-4 h-4', item.color)} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-bold text-brand-heading truncate">
                    <span className="font-black">{item.user}</span>{' '}
                    <span className="font-medium text-gray-500">{item.action}</span>
                  </p>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Connected Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-sage/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-sage" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-black text-brand-heading">Usuarios Conectados Ahora</h2>
              <p className="text-[10px] text-gray-400 font-medium">Actividad en tiempo real</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
            {/* Animated pulse ring */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-brand-sage/20"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="relative w-24 h-24 rounded-full bg-brand-sage/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-brand-sage" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-5xl font-black text-brand-heading">38</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                usuarios activos
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                En línea ahora
              </span>
            </div>
          </div>

          {/* Mini stat rows */}
          <div className="space-y-2 mt-auto pt-4 border-t border-gray-50">
            {[
              { label: 'Profesionales', value: '24', color: 'text-brand-sage' },
              { label: 'Empresas', value: '11', color: 'text-brand-gold' },
              { label: 'Administradores', value: '3', color: 'text-brand-coral' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-brand-bg/30 transition-colors"
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className={cn('text-sm font-black', item.color)}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


