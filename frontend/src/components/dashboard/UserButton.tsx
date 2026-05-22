import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import { LogOut, Settings, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface UserButtonProps {
  isCollapsed: boolean;
}

export default function UserButton({ isCollapsed }: UserButtonProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mapeo de roles a nombres amigables
  const roleNames: Record<string, string> = {
    PROFESSIONAL: 'Profesional',
    COMPANY: 'Empresa',
    ADMIN: 'Administrador',
    SUPER_ADMIN: 'Super Admin',
  };

  const userRoleName = roleNames[user?.role || ''] || 'Miembro';

  // Iniciales dinámicas
  const getInitials = (name: string = '') => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      toast.error(handleApiError(err).message);
    }
  };

  // Cerrar el dropdown al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const displayName = user.name || user.email || 'Usuario';
  const avatarText = getInitials(displayName);

  return (
    <div ref={dropdownRef} className={cn('w-full relative transition-all duration-150', isCollapsed ? 'px-2' : 'px-0')}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 group relative outline-none',
          isCollapsed ? 'justify-center' : 'text-left'
        )}
      >
        <div className="h-9 w-9 shrink-0 rounded-xl border border-brand-sage/50 shadow-[0_0_10px_2px_var(--color-brand-sage)] flex items-center justify-center bg-brand-sage/20 text-brand-sage text-[10px] font-bold">
          {avatarText}
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-sm font-bold text-white truncate tracking-tight">{displayName}</p>
            <p className="text-[11px] font-medium text-white/40 truncate mt-0.5">{userRoleName}</p>
          </div>
        )}

        {!isCollapsed && (
          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
        )}

        {isCollapsed && (
          <div className="absolute left-[calc(100%+8px)] px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-1 group-hover:translate-x-3 z-[100] whitespace-nowrap shadow-xl">
            {displayName}
          </div>
        )}
      </button>

      {/* Custom Dropdown Content */}
      {isOpen && (
        <div
          className={cn(
            'absolute w-64 p-2 rounded-2xl shadow-2xl border border-white/10 bg-black text-white z-[120]',
            isCollapsed ? 'bottom-0 left-[calc(100%+12px)]' : 'bottom-[calc(100%+8px)] left-0'
          )}
        >
          {/* Perfil Link dinámico según Rol */}
          <Link
            to={
              user.role === 'ADMIN'
                ? '/dashboard/profile'
                : user.role === 'COMPANY'
                ? '/dashboard/profile'
                : '/dashboard/profile'
            }
            onClick={() => setIsOpen(false)}
            className="rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 group transition-all"
          >
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/40 group-hover:text-brand-sage transition-all">
              <Settings className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm text-white">Mi Perfil</span>
              <span className="text-[9px] text-white/40 font-medium">Gestionar cuenta y seguridad</span>
            </div>
          </Link>

          <div className="mx-2 my-1 border-t border-white/5" />

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full rounded-xl p-3 flex items-center gap-3 cursor-pointer text-red-400 hover:bg-white/5 hover:text-red-400 transition-all font-bold text-left"
          >
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
              <LogOut className="w-4 h-4" />
            </div>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
