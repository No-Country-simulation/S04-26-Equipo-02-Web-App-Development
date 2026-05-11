"use client";

import { 
  Menu, 
  ChevronRight,
  User
} from "lucide-react";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  // Simple breadcrumb logic based on pathname
  
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full group cursor-pointer hover:bg-gray-100 transition-all">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
             <User className="text-white w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-gray-700">Admin</span>
          <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
        </div>
      </div>
    </header>
  );
}
