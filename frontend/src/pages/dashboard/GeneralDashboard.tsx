import { useAuth } from '../../hooks/useAuth';
import ProfessionalDashboard from './ProfessionalDashboard';
import CompanyDashboard from './CompanyDashboard';
import AdminDashboard from './AdminDashboard';

export default function GeneralDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'PROFESSIONAL':
      return <ProfessionalDashboard />;
    case 'COMPANY':
      return <CompanyDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <ProfessionalDashboard />;
  }
}
