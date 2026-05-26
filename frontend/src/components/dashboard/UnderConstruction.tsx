import { Construction, Hammer, Brush, ArrowLeft, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden relative group">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-[100px] -z-10 group-hover:opacity-100 transition-opacity opacity-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-[80px] -z-10 opacity-30" />
      
      {/* Corner Magic Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Cpu className="w-40 h-40 text-brand-sage" />
      </div>

      <motion.div 
        animate={{ 
          rotate: [0, -3, 3, -3, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="w-28 h-28 bg-brand-charcoal rounded-2xl flex items-center justify-center border border-brand-sage/20 shadow-2xl mb-12 relative"
      >
        <div className="absolute inset-0 bg-brand-sage/10 blur-xl opacity-0 hover:opacity-100 transition-opacity" />
        <Construction className="text-brand-sage w-12 h-12" strokeWidth={2.5} />
      </motion.div>

      <div className="space-y-6 max-w-2xl z-10">
        <div className="flex justify-center mb-4">
          <span className="bg-brand-charcoal/5 text-brand-sage border border-brand-sage/20 rounded-full uppercase px-6 py-2 font-black text-[10px] tracking-[0.4em] shadow-sm">
            PROTOCOLO EN DESARROLLO // V0.8.2
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-charcoal leading-tight">
          SISTEMA DE <span className="text-brand-sage not-italic">&quot;{title}&quot;</span> EN CONSTRUCCIÓN.
        </h1>
        
        <p className="text-gray-500 font-bold uppercase tracking-[0.25em] text-[11px] pt-4 leading-[2]">
          NUESTROS INGENIEROS ESTÁN FORJANDO ESTA SECCIÓN CON PRECISIÓN. LA ESTABILIDAD TOTAL DEL SISTEMA SE ALCANZARÁ EN LAS PRÓXIMAS INTERVENCIONES.
        </p>

        <div className="flex items-center justify-center gap-6 mt-12 py-8 border-y border-gray-100">
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic animate-pulse">
            <Hammer className="w-5 h-5 text-brand-sage" />
            OPTIMIZANDO...
          </div>
          <div className="w-2 h-2 rounded-sm bg-brand-sage rotate-45" />
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic animate-pulse delay-75">
            <Brush className="w-5 h-5 text-brand-sage" />
            PULIENDO...
          </div>
        </div>

        <div className="pt-12">
          <Link 
            to="/dashboard" 
            className="group inline-flex items-center gap-6 px-12 py-5 bg-brand-charcoal text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-brand-sage transition-all shadow-xl active:scale-95 border border-brand-sage/20"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
