import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirección de seguridad (Si no está logueado)
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#7B9E6B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div 
      className="h-screen bg-[#F5F0E8] flex overflow-hidden font-sans selection:bg-[#D4C9A8] selection:text-[#1A1A1A]"
      style={{ '--sidebar-width': isSidebarOpen ? (isCollapsed ? '80px' : '288px') : '0px' } as React.CSSProperties}
    >
      
      {/* SIDEBAR WRAPPER */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              width: isCollapsed ? 80 : 288 
            }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 md:relative md:h-full z-50 bg-[#2C2C2C] border-r border-white/5 transition-all duration-150"
          >
            <Sidebar 
              setIsOpen={setIsSidebarOpen} 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* Responsive Navbar Toggle (Mobile or when sidebar is closed) */}
        {!isSidebarOpen && (
          <div className="h-20 flex items-center px-8 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-[#7B9E6B] text-white rounded-lg hover:bg-[#68855A] transition-all shadow-sm active:scale-95 group"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <span className="ml-4 text-sm font-semibold text-gray-500">Abrir Panel Lateral</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scroll-smooth relative">
          <div className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 md:py-10 transition-all duration-300">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
