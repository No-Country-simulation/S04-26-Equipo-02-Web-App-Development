import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { NotFound } from './pages/NotFound';

// Dashboard imports
import DashboardLayout from './components/dashboard/DashboardLayout';
import GeneralDashboard from './pages/dashboard/GeneralDashboard';
import Profile from './pages/dashboard/Profile';
import UnderConstruction from './components/dashboard/UnderConstruction';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Rutas protegidas del Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GeneralDashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Rutas exclusivas para Profesionales */}
        <Route element={<ProtectedRoute allowedRoles={['PROFESSIONAL']} />}>
          <Route path="learning" element={<UnderConstruction title="Mi Ruta" />} />
          <Route path="opportunities" element={<UnderConstruction title="Marketplace" />} />
        </Route>

        {/* Rutas exclusivas para Empresas */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
          <Route path="talent-search" element={<UnderConstruction title="Buscar Talento" />} />
          <Route path="publications" element={<UnderConstruction title="Mis Publicaciones" />} />
        </Route>

        {/* Rutas exclusivas para Administradores */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="users" element={<UnderConstruction title="Usuarios" />} />
          <Route path="metrics" element={<UnderConstruction title="Métricas" />} />
        </Route>

        {/* Rutas compartidas (Profesionales y Administradores) */}
        <Route element={<ProtectedRoute allowedRoles={['PROFESSIONAL', 'ADMIN']} />}>
          <Route path="events" element={<UnderConstruction title="Eventos" />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;