import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, BookOpen, Briefcase, TrendingUp, Search, Users, Target, ArrowRight } from 'lucide-react';

const professionalCards = [
  {
    title: 'Diagnóstico Inicial',
    description: 'Completá tu evaluación para recibir tu ruta de aprendizaje personalizada',
    icon: ClipboardList,
    link: '/diagnostico',
    color: 'bg-brand-sage',
  },
  {
    title: 'Rutas de Aprendizaje',
    description: 'Contenido en habilidades digitales, cognitivas y socioemocionales',
    icon: BookOpen,
    link: '/learning',
    color: 'bg-brand-olive',
  },
  {
    title: 'Bolsa de Trabajo',
    description: 'Explorá oportunidades laborales adaptadas a tu perfil',
    icon: Briefcase,
    link: '/opportunities',
    color: 'bg-brand-gold',
  },
  {
    title: 'Mi Progreso',
    description: 'Seguimiento de tu avance en las rutas de aprendizaje',
    icon: TrendingUp,
    link: '/progress',
    color: 'bg-brand-coral',
  },
];

const companyCards = [
  {
    title: 'Buscar Talento',
    description: 'Explorá el pool de profesionales senior validados',
    icon: Search,
    link: '/talent-search',
    color: 'bg-brand-sage',
  },
  {
    title: 'Mis Postulaciones',
    description: 'Gestioná los candidatos que has preseleccionado',
    icon: Users,
    link: '/candidates',
    color: 'bg-brand-olive',
  },
];

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const isProfessional = user.role === 'PROFESSIONAL';
  const cards = isProfessional ? professionalCards : companyCards;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Hola, <span className="text-brand-sage">{user.name || 'Usuario'}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl font-medium">
            {isProfessional
              ? 'Tu centro de desarrollo profesional'
              : 'Tu centro de gestión de talento'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card) => (
            <Link key={card.link} to={card.link} className="group">
              <Card className="saas-card overflow-hidden h-full hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-sage transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-brand-sage font-bold">
                    <span>Explorar</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {isProfessional && (
          <div className="mt-16 p-8 bg-brand-bg rounded-3xl border border-brand-accent">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-sage rounded-xl flex items-center justify-center text-white">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tu próximo paso</h3>
                <p className="text-gray-600 font-medium">Recomendación personalizada</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed ml-16">
              Completá el diagnóstico inicial para recibir una ruta de aprendizaje
              personalizada según tu perfil y experiencia.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}