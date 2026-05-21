import { useAuth } from '../../../hooks/useAuth';
import ProfessionalDashboard from '../professional/ProfessionalDashboard';
import CompanyDashboard from '../company/CompanyDashboard';
import AdminDashboard from '../admin/AdminDashboard';

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
