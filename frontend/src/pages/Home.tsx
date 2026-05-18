import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Home() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Plataforma de Empleabilidad Senior
          </p>
          
          <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Revalorizamos el talento de profesionales mayores de 45 años
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Diagnóstico personalizado, formación en competencias clave y acceso directo a empresas que valoran la experiencia. Una metodología probada para tu reinserción laboral.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">
              Iniciar Diagnóstico
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Acceso Empresas
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-4xl">
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              { value: "4,500+", label: "Profesionales" },
              { value: "120+", label: "Empresas" },
              { value: "85%", label: "Recolocación" },
              { value: "50+", label: "Cursos" },
            ].map((stat) => (
              <div key={stat.label} className="bg-background p-8 text-center">
                <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}