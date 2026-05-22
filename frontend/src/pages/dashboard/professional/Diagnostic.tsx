import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Cpu, 
  Brain, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { getDiagnosticSkills, submitDiagnosticAnswers, type Skill } from '../../../api/diagnostic';

const CATEGORY_META = {
  DIGITAL: {
    title: 'Habilidades Digitales',
    description: 'Herramientas tecnológicas, software y adaptabilidad digital.',
    icon: Cpu,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  COGNITIVE: {
    title: 'Habilidades Cognitivas',
    description: 'Resolución de problemas, pensamiento crítico y toma de decisiones.',
    icon: Brain,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
  SOCIOEMOTIONAL: {
    title: 'Habilidades Socioemocionales',
    description: 'Comunicación, empatía, colaboración y liderazgo intergeneracional.',
    icon: Users,
    color: 'text-[#7B9E6B]',
    bgColor: 'bg-[#7B9E6B]/10',
    borderColor: 'border-[#7B9E6B]/20',
  },
};

const SCORE_LEVELS = [
  { value: 1, label: 'Inicial', desc: 'Tengo nociones básicas o estoy comenzando a aprenderla.' },
  { value: 2, label: 'En Desarrollo', desc: 'La aplico en tareas sencillas con guía o supervisión.' },
  { value: 3, label: 'Competente', desc: 'La aplico de manera autónoma en mi trabajo cotidiano.' },
  { value: 4, label: 'Avanzado', desc: 'Resuelvo problemas complejos y propongo mejoras utilizando esta habilidad.' },
  { value: 5, label: 'Experto / Referente', desc: 'Tengo dominio total, diseño estrategias y puedo enseñar o guiar a otros.' },
];

export default function Diagnostic() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Steps: 0 = Intro, 1 = DIGITAL, 2 = COGNITIVE, 3 = SOCIOEMOTIONAL, 4 = Review & Submit, 5 = Success
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getDiagnosticSkills();
        setSkills(data);
        // Initialize answers with 3 (Competente) for all loaded skills
        const initialAnswers: Record<string, number> = {};
        data.forEach((s: Skill) => {
          initialAnswers[s.id] = 3;
        });
        setAnswers(initialAnswers);
      } catch {
        toast.error('No pudimos cargar la lista de habilidades. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories: ('DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL')[] = ['DIGITAL', 'COGNITIVE', 'SOCIOEMOTIONAL'];
  const currentCategory = step > 0 && step <= 3 ? categories[step - 1] : null;
  const filteredSkills = currentCategory ? skills.filter(s => s.category === currentCategory) : [];

  const handleScoreChange = (skillId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [skillId]: score }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([skillId, score]) => ({
        skillId,
        score
      }));

      const res = await submitDiagnosticAnswers(formattedAnswers);

      if (res.success) {
        toast.success('¡Diagnóstico enviado correctamente!');
        setStep(5); // Go to success step
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ocurrió un error al enviar tu diagnóstico. Intenta de nuevo.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7B9E6B] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Cargando evaluación de diagnóstico...</p>
        </div>
      </div>
    );
  }

  // Render Category Step
  const renderCategoryStep = () => {
    if (!currentCategory) return null;
    const meta = CATEGORY_META[currentCategory];
    const Icon = meta.icon;

    return (
      <div className="space-y-6 text-left">
        <div className={`p-6 rounded-3xl border ${meta.borderColor} ${meta.bgColor} flex items-start gap-4`}>
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Icon className={`w-8 h-8 ${meta.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{meta.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{meta.description}</p>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">{skill.name}</h3>
                {skill.description && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{skill.description}</p>
                )}
              </div>

              {/* Dominios / Niveles */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
                {SCORE_LEVELS.map((level) => {
                  const isSelected = answers[skill.id] === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleScoreChange(skill.id, level.value)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                        isSelected 
                          ? 'border-[#7B9E6B] bg-[#7B9E6B]/5 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-xs font-black ${isSelected ? 'text-[#7B9E6B]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                          Nivel {level.value}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#7B9E6B] bg-[#7B9E6B]' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-xs font-black ${isSelected ? 'text-[#7B9E6B]' : 'text-gray-900'}`}>{level.label}</h4>
                        <p className="text-[10px] text-gray-500 font-medium leading-tight">{level.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:bg-white text-gray-700 font-bold transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-[#7B9E6B] hover:bg-[#68855A] text-white rounded-xl font-bold transition-all shadow-md text-sm"
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2">
      <AnimatePresence mode="wait">
        {/* STEP 0: INTRO */}
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 md:p-12 border border-gray-100 rounded-3xl shadow-xl shadow-black/5 text-left relative overflow-hidden space-y-8"
          >
            {/* Design patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7B9E6B]/5 rounded-full blur-3xl -z-10" />

            <div className="space-y-3">
              <span className="bg-[#EDE8DB] text-[#7B9E6B] border border-[#7B9E6B]/20 rounded-full px-5 py-1.5 font-black text-[9px] tracking-widest uppercase shadow-sm">
                Autodiagnóstico Profesional
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none pt-2">
                Conoce y Valida tus <span className="text-[#7B9E6B]">Competencias</span>
              </h1>
              <p className="text-gray-500 font-medium leading-relaxed max-w-2xl text-sm md:text-base">
                Esta evaluación nos ayudará a construir tu **Ruta de Aprendizaje personalizada** y a destacar tus fortalezas en el Talent Marketplace de la Red. Tómate unos minutos para reflexionar sobre tu nivel actual en cada competencia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div className="p-5 bg-blue-50/50 border border-blue-100/50 rounded-2xl space-y-2">
                <Cpu className="w-6 h-6 text-blue-600" />
                <h3 className="font-black text-xs uppercase tracking-wider text-gray-800">Digitales</h3>
                <p className="text-[11px] text-gray-500 font-medium">Uso de herramientas colaborativas, metodologías ágiles y capacidad de adaptarte a nuevos ecosistemas virtuales.</p>
              </div>
              <div className="p-5 bg-amber-50/50 border border-amber-100/50 rounded-2xl space-y-2">
                <Brain className="w-6 h-6 text-amber-600" />
                <h3 className="font-black text-xs uppercase tracking-wider text-gray-800">Cognitivas</h3>
                <p className="text-[11px] text-gray-500 font-medium">Resolución de desafíos, mentalidad de crecimiento, pensamiento crítico y análisis estratégico en roles clave.</p>
              </div>
              <div className="p-5 bg-[#7B9E6B]/5 border border-[#7B9E6B]/10 rounded-2xl space-y-2">
                <Users className="w-6 h-6 text-[#7B9E6B]" />
                <h3 className="font-black text-xs uppercase tracking-wider text-[#7B9E6B]">Socioemocionales</h3>
                <p className="text-[11px] text-gray-500 font-medium">Liderazgo intergeneracional, empatía laboral, comunicación efectiva y resiliencia en la transición de carrera.</p>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-3 px-10 py-4 bg-[#7B9E6B] hover:bg-[#68855A] text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
              >
                Comenzar Diagnóstico <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEPS 1-3: CATEGORIES */}
        {step >= 1 && step <= 3 && (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
          >
            {renderCategoryStep()}
          </motion.div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 md:p-12 border border-gray-100 rounded-3xl shadow-xl shadow-black/5 text-left space-y-8"
          >
            <div className="space-y-2">
              <span className="bg-[#EDE8DB] text-[#C4A962] border border-[#C4A962]/20 rounded-full px-5 py-1.5 font-black text-[9px] tracking-widest uppercase shadow-sm">
                Paso Final
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight pt-2">Revisa y Guarda</h2>
              <p className="text-sm text-gray-500 font-medium">
                Verifica tus calificaciones de autoevaluación. Al hacer clic en Guardar, estas habilidades serán vinculadas a tu perfil profesional.
              </p>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-6">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat];
                const catSkills = skills.filter(s => s.category === cat);
                if (catSkills.length === 0) return null;

                return (
                  <div key={cat} className="space-y-3">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <meta.icon className="w-4 h-4" /> {meta.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {catSkills.map((skill) => {
                        const score = answers[skill.id] || 3;
                        const levelLabel = SCORE_LEVELS.find(l => l.value === score)?.label || 'Competente';
                        return (
                          <div key={skill.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700 truncate max-w-[70%]">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase text-gray-400">{levelLabel}</span>
                              <span className="w-6 h-6 rounded-full bg-[#7B9E6B]/15 text-[#7B9E6B] flex items-center justify-center font-black text-xs">
                                {score}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:bg-white text-gray-700 font-bold transition-all text-sm disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-3 px-10 py-4 bg-[#7B9E6B] hover:bg-[#68855A] text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    Finalizar y Guardar <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 md:p-12 border border-gray-100 rounded-3xl shadow-xl shadow-black/5 text-center space-y-8"
          >
            <div className="w-20 h-20 bg-[#7B9E6B]/10 rounded-full flex items-center justify-center mx-auto text-[#7B9E6B]">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">¡Excelente trabajo!</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto text-sm">
                Has completado el diagnóstico inicial. Tus habilidades han sido validadas e integradas a tu perfil, y tu nivel de perfil ha aumentado un **+20%**.
              </p>
            </div>

            <div className="max-w-xs mx-auto p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-[#C4A962]" />
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Perfil Actualizado</span>
                <p className="text-sm font-black text-gray-800">Competencias Vinculadas</p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-10 py-4 bg-[#2C2C2C] hover:bg-black text-white rounded-xl font-bold transition-all shadow-md text-sm"
              >
                Volver al Panel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
