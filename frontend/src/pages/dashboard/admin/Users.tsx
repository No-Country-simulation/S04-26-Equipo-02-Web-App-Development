import { useState, useMemo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Users as UsersIcon,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShieldCheck,
  Building2,
  UserCircle,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

type UserRole = 'PROFESSIONAL' | 'COMPANY' | 'ADMIN';
type UserStatus = 'VERIFICADO' | 'PENDIENTE' | 'SUSPENDIDO';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  lastLogin: string;
  profileCompletion: number;
  location: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockUsers: MockUser[] = [
  { id: '1',  name: 'María García',       email: 'maria.garcia@email.com',      role: 'PROFESSIONAL', status: 'VERIFICADO',  registeredAt: '12/01/2025', lastLogin: 'Hoy 09:32',  profileCompletion: 92, location: 'CABA, Argentina' },
  { id: '2',  name: 'Carlos López',       email: 'carlos.lopez@empresa.com',   role: 'COMPANY',      status: 'VERIFICADO',  registeredAt: '03/02/2025', lastLogin: 'Ayer 18:15', profileCompletion: 78, location: 'Rosario, Argentina' },
  { id: '3',  name: 'Lucía Fernández',    email: 'lucia.f@outlook.com',        role: 'PROFESSIONAL', status: 'PENDIENTE',   registeredAt: '20/02/2025', lastLogin: 'Nunca',     profileCompletion: 45, location: 'Córdoba, Argentina' },
  { id: '4',  name: 'Administrador Red',  email: 'admin@redbienestar.com',     role: 'ADMIN',        status: 'VERIFICADO',  registeredAt: '01/01/2024', lastLogin: 'Hoy 10:00',  profileCompletion: 100, location: 'CABA, Argentina' },
  { id: '5',  name: 'Sofía Martínez',     email: 'sofia.m@empresa.com',        role: 'COMPANY',      status: 'SUSPENDIDO',  registeredAt: '15/03/2025', lastLogin: '10/05/2026', profileCompletion: 60, location: 'Mendoza, Argentina' },
  { id: '6',  name: 'Jorge Ramírez',      email: 'jorge.ramirez@email.com',     role: 'PROFESSIONAL', status: 'VERIFICADO',  registeredAt: '01/04/2025', lastLogin: '20/05/2026', profileCompletion: 88, location: 'La Plata, Argentina' },
  { id: '7',  name: 'Ana Torres',         email: 'ana.torres@correo.com',      role: 'PROFESSIONAL', status: 'PENDIENTE',   registeredAt: '10/04/2025', lastLogin: 'Nunca',     profileCompletion: 30, location: 'Salta, Argentina' },
  { id: '8',  name: 'TechSolutions SA',   email: 'info@techsolutions.com',     role: 'COMPANY',      status: 'VERIFICADO',  registeredAt: '05/05/2025', lastLogin: 'Hoy 08:45',  profileCompletion: 95, location: 'CABA, Argentina' },
  { id: '9',  name: 'Pedro Nuñez',         email: 'pedro.nunez@email.com',      role: 'PROFESSIONAL', status: 'VERIFICADO',  registeredAt: '12/05/2025', lastLogin: '19/05/2026', profileCompletion: 73, location: 'Bariloche, Argentina' },
  { id: '10', name: 'CoachLab SRL',       email: 'contacto@coachlab.com',      role: 'COMPANY',      status: 'PENDIENTE',   registeredAt: '18/05/2025', lastLogin: 'Nunca',     profileCompletion: 25, location: 'CABA, Argentina' },
  { id: '11', name: 'Laura Mendoza',      email: 'laura.mendoza@email.com',     role: 'PROFESSIONAL', status: 'VERIFICADO',  registeredAt: '01/06/2025', lastLogin: 'Ayer 14:20', profileCompletion: 81, location: 'Tucumán, Argentina' },
  { id: '12', name: 'Admin Sistema',      email: 'sysadmin@redbienestar.com',  role: 'ADMIN',        status: 'VERIFICADO',  registeredAt: '15/06/2024', lastLogin: 'Hoy 10:02',  profileCompletion: 100, location: 'CABA, Argentina' },
  { id: '13', name: 'Gabriel Ortiz',      email: 'gabriel.o@correo.com',       role: 'PROFESSIONAL', status: 'SUSPENDIDO',  registeredAt: '20/06/2025', lastLogin: '05/03/2026', profileCompletion: 55, location: 'Mar del Plata, Argentina' },
  { id: '14', name: 'BienestarGrupo',     email: 'info@bienestargrupo.com',    role: 'COMPANY',      status: 'VERIFICADO',  registeredAt: '01/07/2025', lastLogin: 'Hoy 07:30',  profileCompletion: 90, location: 'Rosario, Argentina' },
  { id: '15', name: 'Valentina Ríos',     email: 'valentina.rios@email.com',    role: 'PROFESSIONAL', status: 'VERIFICADO',  registeredAt: '05/07/2025', lastLogin: 'Ayer 20:10', profileCompletion: 67, location: 'CABA, Argentina' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ROLE_LABELS: Record<UserRole, string> = {
  PROFESSIONAL: 'Profesional',
  COMPANY:      'Empresa',
  ADMIN:        'Admin',
};

const ROLE_COLORS: Record<UserRole, string> = {
  PROFESSIONAL: 'bg-brand-sage/10 text-brand-sage border-brand-sage/20',
  COMPANY:      'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
  ADMIN:        'bg-brand-charcoal/10 text-brand-charcoal border-brand-charcoal/20',
};

const STATUS_STYLES: Record<UserStatus, string> = {
  VERIFICADO:  'saas-badge-success',
  PENDIENTE:   'saas-badge-warning',
  SUSPENDIDO:  'saas-badge-error',
};

const ROWS_PER_PAGE = 7;

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Users() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'TODOS'>('TODOS');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'TODOS'>('TODOS');
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  /* -- filtered + paginated data -- */
  const filtered = useMemo(() => {
    let list = [...mockUsers];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    if (roleFilter !== 'TODOS') {
      list = list.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== 'TODOS') {
      list = list.filter((u) => u.status === statusFilter);
    }

    return list;
  }, [search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(safePage * ROWS_PER_PAGE, (safePage + 1) * ROWS_PER_PAGE);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  /* ---------- computed stats ---------- */
  const professionalCount = mockUsers.filter((u) => u.role === 'PROFESSIONAL').length;
  const companyCount     = mockUsers.filter((u) => u.role === 'COMPANY').length;
  const adminCount       = mockUsers.filter((u) => u.role === 'ADMIN').length;
  const pendingCount     = mockUsers.filter((u) => u.status === 'PENDIENTE').length;

  const statsBar = [
    { label: 'Total Usuarios',  value: mockUsers.length, icon: UsersIcon,       color: 'text-brand-sage',     bg: 'bg-brand-sage/10' },
    { label: 'Profesionales',   value: professionalCount, icon: UserCircle,  color: 'text-brand-sage',     bg: 'bg-brand-sage/10' },
    { label: 'Empresas',        value: companyCount,     icon: Building2,   color: 'text-brand-gold',     bg: 'bg-brand-gold/10' },
    { label: 'Administradores', value: adminCount,       icon: ShieldCheck, color: 'text-brand-charcoal', bg: 'bg-brand-charcoal/10' },
    { label: 'Pendientes',      value: pendingCount,     icon: Clock,       color: 'text-brand-coral',    bg: 'bg-brand-coral/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageMeta
        title={user?.name ? `Usuarios — ${user.name}` : 'Gestión de Usuarios'}
        description="Administración de perfiles y cuentas en Red de Bienestar Laboral."
      />

      {/* ================================================================ */}
      {/*  Header                                                           */}
      {/* ================================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-brand-heading tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
            Administración de perfiles — Panel de Control
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  Stats bar                                                        */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statsBar.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className={cn('p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300 shrink-0', stat.bg)}>
              <stat.icon className={cn('w-4 h-4', stat.color)} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-lg font-black text-brand-heading leading-none">{stat.value}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================================================================ */}
      {/*  Search + Filters + Refresh                                       */}
      {/* ================================================================ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-brand-heading font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as UserRole | 'TODOS'); setPage(0); }}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center]"
          >
            <option value="TODOS">Todos los roles</option>
            <option value="PROFESSIONAL">Profesional</option>
            <option value="COMPANY">Empresa</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as UserStatus | 'TODOS'); setPage(0); }}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-semibold text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center]"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="VERIFICADO">Verificado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="SUSPENDIDO">Suspendido</option>
        </select>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-heading hover:border-brand-sage hover:text-brand-sage active:scale-95 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
          Refrescar
        </button>
      </div>

      {/* ================================================================ */}
      {/*  Users Table                                                      */}
      {/* ================================================================ */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* -- head -- */}
            <thead>
              <tr className="border-b border-gray-100">
                <Th>Usuario</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Registro</Th>
                <Th>Perfil</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>

            {/* -- body -- */}
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <UsersIcon className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-400">No se encontraron usuarios</p>
                      <p className="text-[10px] text-gray-300">Probá con otros filtros</p>
                    </div>
                  </td>
                </tr>
              )}

              {pageRows.map((user, i) => {
                const rowBg = i % 2 === 0 ? 'bg-white' : 'bg-brand-bg/40';

                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className={cn(
                      'border-b border-gray-50 transition-colors hover:bg-brand-bg/60 group',
                      rowBg,
                    )}
                  >
                    {/* Usuario */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* Avatar — initials */}
                        <div className="w-9 h-9 rounded-xl bg-brand-charcoal/5 border border-gray-100 flex items-center justify-center font-black text-[11px] text-brand-charcoal/60 shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-black text-brand-heading truncate max-w-[180px]">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium truncate max-w-[180px]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        'inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                        ROLE_COLORS[user.role],
                      )}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3.5">
                      <span className={STATUS_STYLES[user.status]}>
                        {user.status}
                      </span>
                    </td>

                    {/* Registro */}
                    <td className="px-4 py-3.5">
                      <div className="text-left">
                        <p className="text-xs font-semibold text-brand-heading">{user.registeredAt}</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">Último: {user.lastLogin}</p>
                      </div>
                    </td>

                    {/* Perfil % */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              user.profileCompletion >= 80
                                ? 'bg-brand-sage'
                                : user.profileCompletion >= 40
                                  ? 'bg-brand-gold'
                                  : 'bg-brand-coral',
                            )}
                            style={{ width: `${user.profileCompletion}%` }}
                          />
                        </div>
                        <span className={cn(
                          'text-[10px] font-black tabular-nums',
                          user.profileCompletion >= 80
                            ? 'text-brand-sage'
                            : user.profileCompletion >= 40
                              ? 'text-brand-gold'
                              : 'text-brand-coral',
                        )}>
                          {user.profileCompletion}%
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {/* Ver */}
                        <IconButton
                          icon={Eye}
                          tooltip="Ver perfil"
                          className="hover:text-brand-sage"
                        />
                        {/* Editar */}
                        <IconButton
                          icon={Edit3}
                          tooltip="Editar"
                          className="hover:text-brand-gold"
                        />

                        {/* Acción condicional */}
                        {user.status === 'PENDIENTE' && (
                          <IconButton
                            icon={UserCheck}
                            tooltip="Verificar"
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                          />
                        )}
                        {user.status === 'VERIFICADO' && (
                          <IconButton
                            icon={UserX}
                            tooltip="Suspender"
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          />
                        )}
                        {user.status === 'SUSPENDIDO' && (
                          <IconButton
                            icon={UserCheck}
                            tooltip="Reactivar"
                            className="text-brand-sage hover:text-brand-sage-hover hover:bg-brand-sage/10"
                          />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================================================================ */}
        {/*  Pagination                                                       */}
        {/* ================================================================ */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] font-medium text-gray-400">
            Mostrando {pageRows.length} de {filtered.length} usuarios
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-heading hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  'w-7 h-7 rounded-lg text-[11px] font-bold transition-all',
                  i === safePage
                    ? 'bg-brand-sage text-white shadow-sm shadow-brand-sage/20'
                    : 'text-gray-400 hover:text-brand-heading hover:bg-gray-100',
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-heading hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Table header cell */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-brand-bg/20">
      {children}
    </th>
  );
}

/** Round icon button with tooltip */
function IconButton({
  icon: Icon,
  tooltip,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  className?: string;
}) {
  return (
    <button
      title={tooltip}
      className={cn(
        'p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all active:scale-90',
        className,
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
