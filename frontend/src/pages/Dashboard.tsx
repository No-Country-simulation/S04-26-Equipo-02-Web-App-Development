import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const isProfessional = user.role === 'professional';

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Bienvenido, {user.name}</h1>
        <p className="dashboard-subtitle">
          {isProfessional
            ? 'Tu centro de desarrollo profesional'
            : 'Tu centro de gestión de talento'}
        </p>
      </header>

      {isProfessional ? (
        <>
          <section className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon">📋</div>
              <h3>Tu Perfil Profesional</h3>
              <p>Completá tu diagnóstico inicial para recibir tu ruta de aprendizaje personalizada</p>
              <Link to="/diagnostico" className="btn btn-secondary">
                Comenzar diagnóstico
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📚</div>
              <h3>Rutas de Aprendizaje</h3>
              <p>Accedé a contenidos en habilidades digitales, cognitivas y socioemocionales</p>
              <Link to="/learning" className="btn btn-secondary">
                Ver cursos
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">💼</div>
              <h3>Bolsa de Trabajo</h3>
              <p>Explorá oportunidades laborales adaptadas a tu perfil</p>
              <Link to="/opportunities" className="btn btn-secondary">
                Ver oportunidades
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Mi Progreso</h3>
              <p>Seguimiento de tu avance en las rutas de aprendizaje</p>
              <Link to="/progress" className="btn btn-secondary">
                Ver progreso
              </Link>
            </div>
          </section>

          <section className="dashboard-info">
            <div className="info-box">
              <h4>🎯 Tu próximo paso</h4>
              <p>
                Completá el diagnóstico inicial para recibir una ruta de aprendizaje
                personalizada según tu perfil y experiencia.
              </p>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon">🔍</div>
              <h3>Buscar Talento</h3>
              <p>Explorá el pool de profesionales senior validados</p>
              <Link to="/talent-search" className="btn btn-secondary">
                Buscar candidatos
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📋</div>
              <h3>Mis Postulaciones</h3>
              <p>Gestioná los candidatos que has preseleccionado</p>
              <Link to="/candidates" className="btn btn-secondary">
                Ver candidatos
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}