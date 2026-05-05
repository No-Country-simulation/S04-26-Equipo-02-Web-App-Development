import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Placeholder para rutas futuras (protegidas) */}
        <Route path="/diagnostico" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/opportunities" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/talent-search" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

// Componente temporal para rutas en desarrollo
function ComingSoon() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>🚧 En construcción</h2>
      <p>Esta sección está en desarrollo. ¡Pronto estará disponible!</p>
    </div>
  );
}

export default App;