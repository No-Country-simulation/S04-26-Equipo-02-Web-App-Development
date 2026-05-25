import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/public/Home';
import { Login } from './pages/auth/Login';
import { AdminLogin } from './pages/auth/AdminLogin';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { NotFound } from './components/NotFound';

// Dashboard imports
import DashboardLayout from './components/dashboard/DashboardLayout';
import GeneralDashboard from './pages/dashboard/shared/GeneralDashboard';
import Profile from './pages/dashboard/shared/Profile';
import CvPreview from './pages/dashboard/CvPreview';
import Diagnostic from './pages/dashboard/professional/Diagnostic';
import Learning from './pages/dashboard/professional/Learning';
import Opportunities from './pages/dashboard/professional/Opportunities';
import TalentSearch from './pages/dashboard/company/TalentSearch';
import Publications from './pages/dashboard/company/Publications';
import Events from './pages/dashboard/shared/Events';
import Users from './pages/dashboard/admin/Users';
import Metrics from './pages/dashboard/admin/Metrics';
import About from './pages/public/About';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/about" element={<About />} />

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
        <Route path="cv-preview" element={<CvPreview />} />

        {/* Rutas exclusivas para Profesionales */}
        <Route element={<ProtectedRoute allowedRoles={['PROFESSIONAL']} />}>
          <Route path="learning" element={<Learning />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="diagnostic" element={<Diagnostic />} />
        </Route>

        {/* Rutas exclusivas para Empresas */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
          <Route path="talent-search" element={<TalentSearch />} />
          <Route path="publications" element={<Publications />} />
        </Route>

        {/* Rutas exclusivas para Administradores */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="users" element={<Users />} />
          <Route path="metrics" element={<Metrics />} />
        </Route>

        {/* Rutas compartidas (Profesionales y Administradores) */}
        <Route element={<ProtectedRoute allowedRoles={['PROFESSIONAL', 'ADMIN']} />}>
          <Route path="events" element={<Events />} />
        </Route>

        {/* 404 dentro del dashboard */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;