import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import ProfessionalDashboard from '../professional/ProfessionalDashboard';
import CompanyDashboard from '../company/CompanyDashboard';
import AdminDashboard from '../admin/AdminDashboard';

export default function GeneralDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const title = user?.name ? `Panel de ${user.name}` : 'Dashboard';

  const dashboardContent = (() => {
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
  })();

  return (
    <>
      <PageMeta title={title} description="Panel de control de tu cuenta en Red de Bienestar Laboral." />
      {dashboardContent}
    </>
  );
}
