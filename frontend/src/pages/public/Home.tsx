import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Cpu, 
  Brain, 
  Users, 
  Award, 
  Star, 
  Check, 
  ShieldCheck, 
  ArrowUpRight, 
  HeartHandshake 
} from 'lucide-react';
import heroImage from '../../assets/senior_professionals_meeting.png';

// Test Questions for the Interactive Diagnostic Sandbox
interface MockQuestion {
  id: string;
  category: 'DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL';
  title: string;
  question: string;
  options: {
    key: string;
    text: string;
    score: number;
    feedback: string;
  }[];
}

const MOCK_QUESTIONS: Record<string, MockQuestion> = {
  DIGITAL: {
    id: 'q-dig',
    category: 'DIGITAL',
    title: 'Habilidad Digital',
    question: '¿Cómo reaccionas cuando tu empresa introduce una nueva herramienta de Inteligencia Artificial (como ChatGPT o Copilots)?',
    options: [
      { 
        key: 'A', 
        text: 'Evito usarla en lo posible y continúo con mis métodos tradicionales y de confianza.', 
        score: 1,
        feedback: 'Nivel Inicial. La IA no viene a reemplazar tu experiencia, sino a potenciarla. ¡Conéctate con nuestra capacitación!'
      },
      { 
        key: 'B', 
        text: 'La utilizo ocasionalmente para redactar correos, pero me cuesta ver su valor real en mi día a día.', 
        score: 3,
        feedback: 'Nivel Intermedio. Tienes curiosidad, pero te falta descubrir casos de uso de nivel senior para maximizar tu productividad.'
      },
      { 
        key: 'C', 
        text: 'La investigo activamente para automatizar mis tareas repetitivas y así liberar tiempo para el análisis estratégico.', 
        score: 5,
        feedback: 'Nivel Experto / Diamante. Integras tecnología para escalar tu aporte de valor. ¡Eres el diamante tecnológico que las empresas buscan!'
      }
    ]
  },
  COGNITIVE: {
    id: 'q-cog',
    category: 'COGNITIVE',
    title: 'Habilidad Cognitiva',
    question: '¿Cómo abordas un problema de negocio crítico y complejo que tu equipo de trabajo actual no sabe cómo resolver?',
    options: [
      { 
        key: 'A', 
        text: 'Espero instrucciones directas de la gerencia o del área responsable antes de tomar acción.', 
        score: 1,
        feedback: 'Nivel Inicial. A veces hace falta dar un paso al frente. Tu experiencia acumulada es clave para guiar la solución.'
      },
      { 
        key: 'B', 
        text: 'Analizo la situación de forma individual y propongo la misma metodología que funcionó en el pasado.', 
        score: 3,
        feedback: 'Nivel Intermedio. La experiencia histórica es excelente, pero combinarla con el contexto digital actual creará mejores soluciones.'
      },
      { 
        key: 'C', 
        text: 'Facilito una sesión de ideas combinando mi experiencia táctica con datos actuales para diseñar una respuesta innovadora.', 
        score: 5,
        feedback: 'Nivel Experto / Diamante. Tu pensamiento crítico y visión de helicóptero resuelven crisis complejas. ¡Esto es liderazgo puro!'
      }
    ]
  },
  SOCIOEMOTIONAL: {
    id: 'q-soc',
    category: 'SOCIOEMOTIONAL',
    title: 'Habilidad Socioemocional',
    question: 'Cuando surge un conflicto de opiniones o tensión en un equipo multidisciplinar con profesionales jóvenes, ¿cómo actúas?',
    options: [
      { 
        key: 'A', 
        text: 'Prefiero mantenerme al margen para evitar roces y que ellos mismos solucionen sus diferencias.', 
        score: 1,
        feedback: 'Nivel Inicial. La neutralidad es cómoda, pero el equipo pierde la oportunidad de contar con una mediación sabia.'
      },
      { 
        key: 'B', 
        text: 'Intervengo de inmediato imponiendo mi experiencia y dictaminando la dirección correcta para agilizar el proyecto.', 
        score: 3,
        feedback: 'Nivel Intermedio. Tu determinación resuelve el problema inmediato, pero a expensas de la cohesión del equipo.'
      },
      { 
        key: 'C', 
        text: 'Escucho activamente a ambas partes, fomento la empatía intergeneracional y facilito un consenso constructivo.', 
        score: 5,
        feedback: 'Nivel Experto / Diamante. Lideras con Inteligencia Emocional y mentoría, el pegamento social que toda organización sana necesita.'
      }
    ]
  }
};

export function Home() {
  const [activeCategory, setActiveCategory] = useState<'DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL'>('DIGITAL');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = MOCK_QUESTIONS[activeCategory];
  const selectedObj = currentQuestion.options.find(opt => opt.key === selectedOption);

  return (
    <div className="bg-[#F5F0E8] text-gray-800 min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">


            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight"
            >
              Conectamos <span className="text-brand-sage relative">Senior</span> <span className="text-[#C4A962]">+45</span> con empresas de alto impacto
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl"
            >
              La Inteligencia Artificial automatiza procesos, pero la sabiduría humana toma las decisiones trascendentales. Certificamos tus competencias digitales, cognitivas y socioemocionales para el mercado actual.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link 
                to="/register" 
                className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2 group text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-brand-sage/30 transition-all duration-300"
              >
                Comenzar Autodiagnóstico
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl border-2 hover:bg-white/50 transition-all duration-300"
              >
                Acceso para Empresas
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Quick trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-[#EDE8DB] flex flex-wrap gap-8 items-center text-[#8B9A6B]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold">Diagnóstico Certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-bold">Mentoría Integrada</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5" />
                <span className="text-sm font-bold">Talento Humano Valioso</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[450px] aspect-square"
            >
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={heroImage} 
                  alt="Talento Senior e Inteligencia Artificial en Red de Bienestar"
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Overlay Glass Badge 1 */}
              <div 
                className="absolute top-6 -left-6 md:-left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 pr-6 min-w-[210px] z-10"
              >
                <div className="w-10 h-10 bg-brand-sage/20 rounded-xl flex items-center justify-center text-brand-sage shrink-0">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Liderazgo</p>
                  <p className="text-sm font-bold text-gray-800 whitespace-nowrap">Inteligencia Emocional</p>
                </div>
              </div>

              {/* Overlay Glass Badge 2 */}
              <div 
                className="absolute -bottom-4 -right-6 md:-right-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 pr-6 min-w-[250px] z-10"
              >
                <div className="w-10 h-10 bg-[#C4A962]/20 rounded-xl flex items-center justify-center text-[#C4A962] shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Evaluación</p>
                  <p className="text-sm font-bold text-gray-800 whitespace-nowrap">Habilidades +45 Validadas</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. THE SENIOR DIAMOND VALUE PROPOSITION (IA VS HUMANO) */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-y border-[#EDE8DB]">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B9A6B]">
              La Revolución Silenciosa
            </h2>
            <p className="mt-4 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              ¿Por qué el talento senior es el activo definitivo en la era de la IA?
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Mientras la Inteligencia Artificial procesa información y automatiza tareas repetitivas, el verdadero valor reside en guiar las organizaciones con criterio ético y resiliencia estratégica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Inteligencia Emocional */}
            <div className="saas-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#FDF5F3] rounded-2xl flex items-center justify-center text-brand-coral mb-6 border border-[#D4826A]/20">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inteligencia Emocional & Cohesión</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Los profesionales de más de 45 años aportan templanza en momentos de incertidumbre, resuelven conflictos interpersonales y actúan como mentores naturales para los equipos más jóvenes.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-brand-coral text-xs font-bold uppercase tracking-wider">
                <span>Irremplazable por algoritmo</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2: Pensamiento Crítico */}
            <div className="saas-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#C4A962] mb-6 border border-[#C4A962]/20">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resolución de Crisis y Criterio</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Haber navegado por múltiples crisis económicas, cambios de paradigma tecnológico y transiciones empresariales otorga un "sexto sentido" estratégico que ninguna máquina puede proyectar.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-[#C4A962] text-xs font-bold uppercase tracking-wider">
                <span>Visión estratégica humana</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

            {/* Card 3: Adaptabilidad Certificada */}
            <div className="saas-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#F3F7F2] rounded-2xl flex items-center justify-center text-[#7B9E6B] mb-6 border border-[#7B9E6B]/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptabilidad Digital</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Evaluamos y capacitamos a nuestros profesionales para integrar herramientas de IA en sus áreas, asegurando que su vasta experiencia de negocio actúe como copiloto de la tecnología más avanzada.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-[#7B9E6B] text-xs font-bold uppercase tracking-wider">
                <span>Seniority tecnológico activo</span>
                <Check className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* AI vs Human comparison box */}
          <div className="mt-16 bg-[#F5F0E8] border border-[#D4C9A8] rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-sage bg-white border border-[#7B9E6B]/20 px-3 py-1 rounded-full">
                  Comparativa de Valor
                </span>
                <h3 className="mt-4 text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                  La IA hace el trabajo pesado, el Senior aporta la dirección
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Las empresas que intentan automatizar todo descubren que pierden cohesión, criterio táctico y calidad en el trato con clientes. La clave del éxito corporativo actual es la simbiosis intergeneracional y tecnológica.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 font-bold text-sm">IA</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Procesa y Estructura</h4>
                    <p className="text-xs text-gray-500 mt-1">Escribe borradores, resume informes, depura código repetitivo y predice comportamientos basados en datos históricos.</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-sm">+45</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Cuestiona, Conecta y Lidera</h4>
                    <p className="text-xs text-gray-500 mt-1">Valida la veracidad, empatiza con clientes difíciles, coordina el talento joven y decide la visión estratégica de largo plazo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE DIAGNOSTIC SANDBOX (MINI-TEST EN VIVO) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B9A6B]">Pruébalo en Vivo</span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Mide tu nivel de competencia profesional
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Nuestro autodiagnóstico analiza tus competencias blandas e integración técnica. Respondé a esta pregunta de ejemplo para ver cómo funciona el algoritmo de evaluación.
            </p>

            {/* Category tabs */}
            <div className="mt-8 flex flex-col gap-3">
              {[
                { id: 'DIGITAL', label: 'Habilidad Digital', icon: Cpu },
                { id: 'COGNITIVE', label: 'Habilidad Cognitiva', icon: Brain },
                { id: 'SOCIOEMOTIONAL', label: 'Habilidad Socioemocional', icon: Users },
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id as 'DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL');
                      setSelectedOption(null);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left font-bold text-sm transition-all duration-300 ${
                      isSelected 
                        ? 'bg-brand-sage text-white border-brand-sage shadow-md' 
                        : 'bg-[#EDE8DB] text-gray-700 border-[#D4C9A8] hover:bg-[#EDE8DB]/85'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sage/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-brand-sage/10 text-brand-sage rounded-full text-xs font-bold uppercase">
                  {currentQuestion.title}
                </span>
                <span className="text-gray-400 text-xs">• Diagnóstico Gratuito</span>
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-4">
                {currentQuestion.options.map(opt => {
                  const isChecked = selectedOption === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedOption(opt.key)}
                      className={`w-full text-left p-5 rounded-2xl border-2 flex gap-4 transition-all duration-200 ${
                        isChecked 
                          ? 'border-brand-sage bg-[#F3F7F2]' 
                          : 'border-gray-100 hover:border-brand-sage/30 bg-gray-50/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-xs shrink-0 ${
                        isChecked 
                          ? 'bg-brand-sage border-brand-sage text-white' 
                          : 'border-gray-300 text-gray-500'
                      }`}>
                        {opt.key}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic feedback segment */}
              <AnimatePresence mode="wait">
                {selectedOption && selectedObj && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 p-6 bg-[#F5F0E8] border border-[#D4C9A8] rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#8B9A6B] uppercase tracking-wider">Resultado del Algoritmo</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < selectedObj.score ? 'text-[#C4A962] fill-[#C4A962]' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-800">{selectedObj.feedback}</p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">Puntaje estimado: {selectedObj.score}/5</span>
                      <Link 
                        to="/register" 
                        className="text-xs font-bold text-brand-sage hover:text-brand-olive flex items-center gap-1"
                      >
                        Completar Diagnóstico Total
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </section>

      {/* 4. DUAL TARGET SEGMENT (PROFESIONALES VS EMPRESAS) */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-[#EDE8DB]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Column 1: For Professionals */}
            <div className="bg-[#F5F0E8] border border-[#D4C9A8] rounded-3xl p-8 lg:p-12 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8B9A6B] bg-[#EDE8DB] px-3.5 py-1.5 rounded-full border border-[#D4C9A8]/50">
                  Para Profesionales (+45)
                </span>
                <h3 className="mt-6 text-3xl font-black text-gray-900 leading-tight">
                  Toma el control de tu próximo gran salto
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  No estás fuera del juego; estás en el momento de mayor madurez profesional. Certificá tus capacidades y accedé a proyectos que valoran tu seniority.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    'Diagnóstico integral de competencias socio-técnicas.',
                    'Rutas formativas ágiles para integrar Inteligencia Artificial.',
                    'CV Vivo exportable e interactivo para postularte.',
                    'Acceso al Marketplace exclusivo de vacantes senior.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-brand-sage/20 flex items-center justify-center text-brand-sage shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link 
                  to="/register" 
                  className="btn-primary w-full text-center flex items-center justify-center gap-2 text-base px-6 py-4 rounded-xl"
                >
                  Registrarme como Profesional
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Column 2: For Companies */}
            <div className="bg-[#EDE8DB] border border-[#D4C9A8] rounded-3xl p-8 lg:p-12 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C4A962] bg-[#F5F0E8] px-3.5 py-1.5 rounded-full border border-[#D4C9A8]/50">
                  Para Empresas (Companies)
                </span>
                <h3 className="mt-6 text-3xl font-black text-gray-900 leading-tight">
                  Reduzca la rotación con liderazgo probado
                </h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Contrate experiencia. Incorpore líderes listos para operar desde el día uno, con alta adaptabilidad al cambio y sólidas habilidades blandas evaluadas.
                </p>

                <ul className="mt-8 space-y-4">
                  {[
                    'Buscador inteligente de candidatos con competencias validadas.',
                    'Perfiles senior listos para actuar como mentores e integradores.',
                    'Filtros avanzados por roles, seniority e inteligencia emocional.',
                    'Proceso ágil de preselección directo desde la plataforma.'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-[#C4A962]/20 flex items-center justify-center text-[#C4A962] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link 
                  to="/login" 
                  className="btn-secondary bg-white hover:bg-white/70 w-full text-center flex items-center justify-center gap-2 text-base px-6 py-4 rounded-xl"
                >
                  Registrar / Acceder como Empresa
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. IMPACT STATS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "4,500+", label: "Profesionales Registrados" },
              { value: "120+", label: "Empresas Aliadas" },
              { value: "85%", label: "Tasa de Recolocación" },
              { value: "95%", label: "Satisfacción Corporativa" },
            ].map((stat, index) => (
              <div key={index} className="text-center md:border-r md:last:border-r-0 border-gray-100 last:border-0 py-4">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-brand-sage block mb-2">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. REAL SUCCESS STORIES (TESTIMONIALS) */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-[#EDE8DB]">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B9A6B]">Testimonios Reales</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Voces de nuestra Red de Empleabilidad
            </h2>
            <p className="mt-4 text-gray-500">
              Conoce el testimonio tanto de profesionales que han potenciado su inserción como de directivos que confían en el seniority estratégico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Testimonial 1 */}
            <div className="saas-card p-8 flex flex-col justify-between">
              <p className="text-gray-600 italic leading-relaxed text-sm">
                "Después de cumplir 48 años y trabajar más de 20 en finanzas corporativas, sentía que las startups me descartaban por sobrecalificación y desconocimiento de herramientas de automatización. A través del diagnóstico y el curso de IA aplicada, logré revalidar mis habilidades y hoy lidero el equipo financiero en una fintech."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-sage/20 flex items-center justify-center text-brand-sage font-black">
                  AM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Andrés Mendoza</h4>
                  <p className="text-xs text-gray-500">Director Financiero - 50 años</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="saas-card p-8 flex flex-col justify-between">
              <p className="text-gray-600 italic leading-relaxed text-sm">
                "Incorporar ingenieros senior (+45) validado por la Red nos devolvió la estabilidad operativa. Saben comunicarse, no les atemoriza cambiar de rumbo ante fallos y guían con mucha paciencia a los programadores junior. El autodiagnóstico de habilidades blandas nos ahorró meses de entrevistas."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#C4A962]/20 flex items-center justify-center text-[#C4A962] font-black">
                  LV
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Liliana Valenzuela</h4>
                  <p className="text-xs text-gray-500">VP de Recursos Humanos - TechCorp</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. DETAILED RED DIRECTORY FOOTER */}
      <section className="bg-[#EDE8DB] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D4C9A8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-sage rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <span className="text-lg font-black tracking-tight text-gray-900">Red de Bienestar</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              La plataforma líder en validación y conexión del talento senior (+45) en la era digital. El liderazgo y el criterio humano no tienen fecha de vencimiento.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Para Profesionales</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/register" className="hover:text-brand-sage">Realizar Test de Diagnóstico</Link></li>
              <li><Link to="/register" className="hover:text-brand-sage">Rutas de Formación</Link></li>
              <li><Link to="/login" className="hover:text-brand-sage">Ingreso al Panel</Link></li>
              <li><a href="#test" className="hover:text-brand-sage">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Para Empresas</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/login" className="hover:text-brand-sage">Buscador de Candidatos</Link></li>
              <li><Link to="/login" className="hover:text-brand-sage">Registrar Perfil Corporativo</Link></li>
              <li><a href="#planes" className="hover:text-brand-sage">Planes y Coberturas</a></li>
              <li><a href="#casos" className="hover:text-brand-sage">Casos de Éxito de Selección</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Únete al Boletín</h4>
            <p className="text-xs text-gray-500 mb-3">Recibe artículos semanales sobre empleabilidad senior y el impacto del talento humano frente a la IA.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por suscribirte!'); }} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                required 
                className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-brand-sage text-gray-800"
              />
              <button 
                type="submit" 
                className="bg-brand-sage hover:bg-brand-olive text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Unirme
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}