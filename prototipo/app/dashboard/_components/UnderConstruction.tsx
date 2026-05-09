"use client";

import { Construction, Hammer, Brush, ArrowLeft, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12 bg-white rounded-sm border border-[#0a0a0c]/5 shadow-xl shadow-black/5 overflow-hidden relative group">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c89b3c]/5 rounded-full blur-[100px] -z-10 group-hover:opacity-100 transition-opacity opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0a0a0c]/5 rounded-full blur-[80px] -z-10 opacity-30" />
      
      {/* Corner Magic Lines */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
         <Cpu className="w-40 h-40 text-[#c89b3c]" />
      </div>

      <motion.div 
        animate={{ 
          rotate: [0, -3, 3, -3, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-28 h-28 bg-[#0a0a0c] rounded-sm flex items-center justify-center border border-[#c89b3c]/20 shadow-2xl mb-12 relative"
      >
        <div className="absolute inset-0 bg-[#c89b3c]/10 blur-xl opacity-0 hover:opacity-100 transition-opacity" />
        <Construction className="text-[#c89b3c] w-12 h-12" strokeWidth={2.5} />
      </motion.div>

      <div className="space-y-6 max-w-2xl">
        <div className="flex justify-center mb-4">
           <Badge className="bg-[#0a0a0c]/5 text-[#c89b3c] border border-[#c89b3c]/20 rounded-sm uppercase px-6 py-2 font-black text-[10px] tracking-[0.4em] shadow-sm">
              PROTOCOLO EN DESARROLLO // V0.8.2
           </Badge>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#0a0a0c] leading-tight">
          SISTEMA DE <span className="text-[#c89b3c] not-italic">&quot;{title}&quot;</span> EN CONSTRUCCIÓN.
        </h1>
        
        <p className="text-[#a09b8c] font-black uppercase tracking-[0.25em] text-[11px] pt-4 leading-[2]">
          NUESTROS INGENIEROS ESTÁN FORJANDO ESTA SECCIÓN CON PRECISIÓN HEX-TEC. LA ESTABILIDAD TOTAL DEL SISTEMA SE ALCANZARÁ EN LAS PRÓXIMAS INTERVENCIONES.
        </p>

        <div className="flex items-center justify-center gap-6 mt-12 py-8 border-y border-[#0a0a0c]/5">
           <div className="flex items-center gap-3 text-[10px] font-bold text-[#a09b8c] uppercase tracking-widest italic animate-pulse">
              <Hammer className="w-5 h-5 text-[#c89b3c]" />
              OPTMIZANDO...
           </div>
           <div className="w-2 h-2 rounded-sm bg-[#c89b3c] rotate-45" />
           <div className="flex items-center gap-3 text-[10px] font-bold text-[#a09b8c] uppercase tracking-widest italic animate-pulse delay-75">
              <Brush className="w-5 h-5 text-[#c89b3c]" />
              PULIENDO...
           </div>
        </div>

        <div className="pt-16">
          <Link 
            href="/dashboard" 
            className="group inline-flex items-center gap-6 px-12 py-6 bg-[#0a0a0c] text-white rounded-sm font-black text-[12px] uppercase tracking-[0.3em] hover:bg-[#c89b3c] hover:text-[#0a0a0c] transition-all shadow-xl active:scale-95 border border-[#c89b3c]/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
