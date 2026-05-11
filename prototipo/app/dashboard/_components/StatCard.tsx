"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'pending' | 'danger';
}

export default function StatCard({ 
  label, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'primary' 
}: StatCardProps) {
  
  const variants = {
    primary: "text-[#c89b3c] bg-[#c89b3c]/5 border-[#c89b3c]/20 hover:border-[#c89b3c]/40",
    success: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    pending: "text-amber-500 bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
    danger: "text-rose-500 bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
  };

  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: 'rgba(200, 155, 60, 0.4)' }}
      className={cn(
        "p-12 rounded-sm border bg-white shadow-xl shadow-black/5 border-[#0a0a0c]/5 relative overflow-hidden group transition-all"
      )}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#c89b3c]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#c89b3c]/20 to-transparent group-hover:via-[#c89b3c] transition-all duration-1000" />
      
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-4">
           {/* H2 Style for Labels: font-bold uppercase tracking-widest */}
           <p className="text-[10px] font-bold text-[#a09b8c] uppercase tracking-[0.3em] leading-none mb-4">{label}</p>
           {/* H1 Value style (lite): font-black uppercase italic tracking-tighter */}
           <p className={cn("text-5xl font-black tracking-tighter italic uppercase leading-none group-hover:scale-105 transition-transform origin-left", 
               variant === 'primary' ? 'text-[#c89b3c]' : 'text-[#0a0a0c]'
           )}>{value}</p>
        </div>
        <div className={cn(
          "w-16 h-16 rounded-sm flex items-center justify-center border transition-all shadow-md group-hover:rotate-6 active:scale-95",
          variants[variant]
        )}>
          <Icon className="w-8 h-8" strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
         <div className="relative flex h-1.5 w-1.5">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", 
              variant === 'primary' ? 'bg-[#c89b3c]' : (variant === 'pending' ? 'bg-amber-500' : 'bg-emerald-500')
            )}></span>
            <span className={cn("relative inline-flex rounded-full h-1.5 w-2", 
              variant === 'primary' ? 'bg-[#c89b3c]' : (variant === 'pending' ? 'bg-amber-500' : 'bg-emerald-500')
            )}></span>
         </div>
         <span className="text-[10px] font-black text-[#a09b8c] uppercase tracking-[0.3em] opacity-40 italic">{subtitle}</span>
      </div>
    </motion.div>
  );
}
