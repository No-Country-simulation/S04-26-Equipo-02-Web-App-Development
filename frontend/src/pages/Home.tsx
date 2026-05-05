import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="container-main py-24 lg:py-32">
      <div className="container-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          Plataforma de Empleabilidad Senior
        </p>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Revalorizamos el talento de profesionales mayores de 45 años
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          Diagnóstico personalizado, formación en competencias clave y acceso directo a empresas que valoran la experiencia. Una metodología probada para tu reinserción laboral.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register" className="btn-primary">
            Iniciar Diagnóstico
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-4 w-4"
              aria-hidden="true"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
          <Link to="/login" className="btn-secondary">
            Acceso Empresas
          </Link>
        </div>
      </div>

      <div className="container-stats">
        <div className="grid grid-cols-2 gap-px bg-gray-200 sm:grid-cols-4">
          <div className="bg-white p-8 text-center">
            <p className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">4,500+</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Profesionales</p>
          </div>
          <div className="bg-white p-8 text-center">
            <p className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">120+</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Empresas</p>
          </div>
          <div className="bg-white p-8 text-center">
            <p className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">85%</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Recolocación</p>
          </div>
          <div className="bg-white p-8 text-center">
            <p className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">50+</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">Cursos</p>
          </div>
        </div>
      </div>
    </div>
  );
}