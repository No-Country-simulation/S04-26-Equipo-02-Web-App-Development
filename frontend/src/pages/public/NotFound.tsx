import { Link } from 'react-router-dom';
import { PageMeta } from '../../hooks/useMeta';

export function NotFound() {
  return (
    <div className="container-main py-24 lg:py-32">
      <PageMeta
        title="Página no encontrada"
        description="La página que buscas no existe o fue movida. Volvé al inicio de Red de Bienestar Laboral."
      />
      <div className="container-center">
        <p className="text-9xl font-bold tracking-tight text-gray-900">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
          Página no encontrada
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}