import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-sage rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <span className="text-lg font-black tracking-tight text-gray-900">Red de Bienestar</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 text-gray-600 hover:text-brand-sage font-bold transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-brand-bg/50 pr-4 pl-1 py-1 rounded-full border border-gray-100 hover:bg-brand-sage/10 transition-all group">
                      <div className="w-8 h-8 bg-brand-sage rounded-full flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Hola, {user?.name || 'Usuario'}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-brand-sage border border-gray-200 rounded-full hover:border-brand-sage transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm font-bold text-gray-600 hover:text-brand-sage transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 bg-brand-sage text-white font-bold rounded-xl hover:bg-brand-olive transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>

            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-gray-600 font-bold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 bg-brand-sage rounded-full flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Hola, {user?.name || 'Usuario'}</span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-left text-gray-600 font-bold py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 font-bold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  className="text-center px-4 py-2.5 bg-brand-sage text-white font-bold rounded-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Red de Bienestar Laboral. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}