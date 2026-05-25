import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { PageMeta } from '../hooks/useMeta';

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
      <PageMeta
        title="Página no encontrada"
        description="La página que buscas no existe o fue movida. Volvé al inicio de Red de Bienestar Laboral."
      />
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[10rem] font-black leading-none tracking-tight text-brand-sage/20 select-none">
          404
        </p>

        <div className="-mt-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-bg">
            <SearchX className="h-8 w-8 text-brand-sage" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Página no encontrada
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-gray-500">
            Lo sentimos, la página que buscas no existe o fue movida.
            Revisá la URL o volvé al inicio.
          </p>

          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-sage px-6 py-3 font-bold text-white transition-all hover:bg-brand-olive hover:shadow-lg hover:shadow-brand-sage/25"
            >
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}