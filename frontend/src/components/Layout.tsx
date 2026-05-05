import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/">Red de Bienestar Laboral</Link>
        </div>
        <nav className="navbar-nav">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Hola, {user?.name}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Iniciar sesión</Link>
              <Link to="/register" className="nav-link btn-primary">Registrarse</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Red de Bienestar Laboral. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}