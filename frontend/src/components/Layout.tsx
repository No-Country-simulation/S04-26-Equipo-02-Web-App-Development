import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 shadow-md shadow-black/5 border-b border-gray-100' 
          : 'bg-white/80 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-brand-sage rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-sage/30">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <span className="text-lg font-black tracking-tight text-gray-900">Red de Bienestar</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="relative flex items-center gap-2 text-gray-600 hover:text-brand-sage font-bold transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-sage after:transition-all after:duration-300 hover:after:w-full"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-brand-bg/50 pr-4 pl-1 py-1 rounded-full border border-gray-100 hover:bg-brand-sage/10 hover:border-brand-sage/30 hover:shadow-sm transition-all group">
                      <div className="w-8 h-8 bg-brand-sage rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Hola, {user?.name || 'Usuario'}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-brand-sage border border-gray-200 rounded-full hover:border-brand-sage hover:bg-brand-sage/5 transition-all active:scale-95"
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
                    className="relative text-sm font-bold text-gray-600 hover:text-brand-sage transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-sage after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 bg-brand-sage text-white font-bold rounded-xl hover:bg-brand-olive hover:shadow-lg hover:shadow-brand-sage/25 transition-all active:scale-95"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>

            <button 
              className="md:hidden p-2 text-gray-600 hover:text-brand-sage transition-colors active:scale-90"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 text-gray-600 font-bold py-2 hover:text-brand-sage transition-colors"
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
                      className="flex items-center gap-2 text-left text-gray-600 font-bold py-2 hover:text-brand-sage transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial="closed"
                    animate="open"
                    variants={{
                      open: { transition: { staggerChildren: 0.08 } },
                      closed: {},
                    }}
                    className="flex flex-col gap-3"
                  >
                    <motion.div
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -20 },
                      }}
                    >
                      <Link 
                        to="/login" 
                        className="block text-gray-600 font-bold py-2 hover:text-brand-sage transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -20 },
                      }}
                    >
                      <Link 
                        to="/register" 
                        className="block text-center px-4 py-2.5 bg-brand-sage text-white font-bold rounded-xl hover:bg-brand-olive transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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