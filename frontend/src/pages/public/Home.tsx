import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function StatsCounter({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      className="bg-background p-8 text-center relative"
    >
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: 'spring', stiffness: 100 }}
        className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {value}
      </motion.p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}

export function Home() {
  const statsRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  } as const;

  return (
    <div className="bg-background relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-brand-sage/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-bg/50 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32 relative">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Plataforma de Empleabilidad Senior
          </motion.p>
          
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-foreground via-brand-sage to-brand-gold bg-clip-text text-transparent">
              Revalorizamos el talento de profesionales mayores de 45 años
            </span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-relaxed text-muted-foreground"
          >
            Diagnóstico personalizado, formación en competencias clave y acceso directo a empresas que valoran la experiencia. Una metodología probada para tu reinserción laboral.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/register" className="btn-primary">
              Iniciar Diagnóstico
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Acceso Empresas
            </Link>
          </motion.div>
        </motion.div>

        <div ref={statsRef} className="mx-auto mt-24 max-w-4xl">
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              { value: "4,500+", label: "Profesionales" },
              { value: "120+", label: "Empresas" },
              { value: "85%", label: "Recolocación" },
              { value: "50+", label: "Cursos" },
            ].map((stat, index) => (
              <StatsCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}