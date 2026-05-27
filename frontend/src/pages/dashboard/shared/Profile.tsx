import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import * as profileApi from '../../../api/profiles';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import { Loader2, Eye } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import type { ProfessionalProfile, BasicFormState, CompanyFormState } from '../../../components/dashboard/profile/types';
import CompanyProfileForm from '../../../components/dashboard/profile/CompanyProfileForm';
import ProfileTabs from '../../../components/dashboard/profile/ProfileTabs';
import BasicInfoForm from '../../../components/dashboard/profile/BasicInfoForm';
import ExperienceSection from '../../../components/dashboard/profile/ExperienceSection';
import EducationSection from '../../../components/dashboard/profile/EducationSection';
import CertificationsSection from '../../../components/dashboard/profile/CertificationsSection';
import LanguagesSection from '../../../components/dashboard/profile/LanguagesSection';
import SkillsSection from '../../../components/dashboard/profile/SkillsSection';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'languages'>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    title: string;
    message: string;
    onConfirm: (id: string) => Promise<void>;
  } | null>(null);

  const [basicForm, setBasicForm] = useState<BasicFormState>({
    firstName: '', lastName: '', professionalTitle: '', valueProposition: '',
    yearsOfExperience: 0, phone: '', location: '', bio: '', linkedinUrl: '',
    portfolioUrl: '', availability: 'AVAILABLE', preferredModality: 'REMOTE', salaryExpectation: '',
  });

  const [companyForm, setCompanyForm] = useState<CompanyFormState>({
    companyName: '',
    industry: '',
    website: '',
    description: '',
    location: '',
  });

  const loadProfile = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'PROFESSIONAL') {
        const data = await profileApi.getMyProfile();
        setProfile(data);
        setBasicForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          professionalTitle: data.professionalTitle || '',
          valueProposition: data.valueProposition || '',
          yearsOfExperience: data.yearsOfExperience || 0,
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          linkedinUrl: data.linkedinUrl || '',
          portfolioUrl: data.portfolioUrl || '',
          availability: data.availability || 'AVAILABLE',
          preferredModality: data.preferredModality || 'REMOTE',
          salaryExpectation: data.salaryExpectation || '',
        });
      } else if (user.role === 'COMPANY') {
        const data = await profileApi.getCompanyProfile();
        setCompanyForm({
          companyName: data.companyName || '',
          industry: data.industry || '',
          website: data.website || '',
          description: data.description || '',
          location: '',
        });
      }
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    if (user?.role === 'PROFESSIONAL' || user?.role === 'COMPANY') {
      Promise.resolve().then(() => { if (active) loadProfile(); });
    } else {
      Promise.resolve().then(() => { if (active) setLoading(false); });
    }
    return () => { active = false; };
  }, [user, loadProfile]);

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.role === 'PROFESSIONAL') {
        const payload = { ...basicForm, yearsOfExperience: Number(basicForm.yearsOfExperience) };
        const res = await profileApi.updateMyProfile(payload);
        if (res.success) {
          toast.success('¡Información de perfil actualizada!');
          updateUser({ name: `${basicForm.firstName} ${basicForm.lastName}`.trim(), firstName: basicForm.firstName, lastName: basicForm.lastName });
          loadProfile();
        }
      } else {
        const res = await profileApi.updateCompanyProfile(companyForm);
        if (res.success) {
          toast.success('¡Perfil de empresa guardado con éxito!');
          updateUser({ name: companyForm.companyName });
          loadProfile();
        }
      }
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = async (data: { company: string; role: string; startDate: string; endDate: string; isCurrent: boolean; description: string }) => {
    setSaving(true);
    try {
      await profileApi.addExperience({
        company: data.company,
        role: data.role,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.isCurrent || !data.endDate ? null : new Date(data.endDate).toISOString(),
        description: data.description || undefined,
      });
      toast.success('Experiencia agregada correctamente');
      loadProfile();
    } catch (err) {
      toast.error(handleApiError(err).message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    setConfirmDelete({
      id,
      title: 'Eliminar experiencia',
      message: '¿Estás seguro de eliminar esta experiencia laboral? Esta acción no se puede deshacer.',
      onConfirm: async (deleteId) => {
        setSaving(true);
        try {
          await profileApi.deleteExperience(deleteId);
          toast.success('Experiencia eliminada correctamente');
          loadProfile();
        } catch (err) { toast.error(handleApiError(err).message); }
        setSaving(false);
      },
    });
  };

  const handleAddEducation = async (data: { institution: string; degree: string; year: number }) => {
    setSaving(true);
    try {
      await profileApi.addEducation({
        institution: data.institution,
        degree: data.degree,
        year: Number(data.year),
      });
      toast.success('Educación agregada correctamente');
      loadProfile();
    } catch (err) {
      toast.error(handleApiError(err).message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    setConfirmDelete({
      id,
      title: 'Eliminar formación',
      message: '¿Estás seguro de eliminar esta formación educativa? Esta acción no se puede deshacer.',
      onConfirm: async (deleteId) => {
        setSaving(true);
        try {
          await profileApi.deleteEducation(deleteId);
          toast.success('Educación eliminada correctamente');
          loadProfile();
        } catch (err) { toast.error(handleApiError(err).message); }
        setSaving(false);
      },
    });
  };

  const handleAddCertification = async (data: { name: string; issuer: string; issueDate: string; url: string }) => {
    setSaving(true);
    try {
      await profileApi.addCertification({
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate ? new Date(data.issueDate).toISOString() : null,
        url: data.url || null,
      });
      toast.success('Certificación agregada correctamente');
      loadProfile();
    } catch (err) {
      toast.error(handleApiError(err).message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    setConfirmDelete({
      id,
      title: 'Eliminar certificación',
      message: '¿Estás seguro de eliminar esta certificación? Esta acción no se puede deshacer.',
      onConfirm: async (deleteId) => {
        setSaving(true);
        try {
          await profileApi.deleteCertification(deleteId);
          toast.success('Certificación eliminada correctamente');
          loadProfile();
        } catch (err) { toast.error(handleApiError(err).message); }
        setSaving(false);
      },
    });
  };

  const handleAddLanguage = async (data: { name: string; level: string }) => {
    setSaving(true);
    try {
      await profileApi.addLanguage(data);
      toast.success('Idioma agregado correctamente');
      loadProfile();
    } catch (err) {
      toast.error(handleApiError(err).message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    setConfirmDelete({
      id,
      title: 'Eliminar idioma',
      message: '¿Estás seguro de eliminar este idioma? Esta acción no se puede deshacer.',
      onConfirm: async (deleteId) => {
        setSaving(true);
        try {
          await profileApi.deleteLanguage(deleteId);
          toast.success('Idioma eliminado correctamente');
          loadProfile();
        } catch (err) { toast.error(handleApiError(err).message); }
        setSaving(false);
      },
    });
  };

  if (loading) {
    return (
      <>
        <PageMeta title="Mi Perfil" description="Gestioná tu perfil profesional en Red de Bienestar Laboral." />
        <div className="min-h-[60vh] flex items-center justify-center bg-brand-bg">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-brand-sage animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Cargando perfil...</p>
          </div>
        </div>
      </>
    );
  }

  if (user?.role === 'ADMIN') {
    return (
      <>
        <PageMeta title="Mi Cuenta — Administrador" description="Configuración de cuenta de administrador en Red de Bienestar Laboral." />
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Cuenta</h1>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">Configuración de administrador</p>
          </div>

          <div className="saas-card p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-brand-sage rounded-full flex items-center justify-center text-white text-2xl font-black">
                {user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'Administrador'}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="saas-badge-success mt-2 inline-block">Administrador</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 bg-gray-50 cursor-not-allowed"
                  value={user.name || ''}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 bg-gray-50 cursor-not-allowed"
                  value={user.email || ''}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rol</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 bg-gray-50 cursor-not-allowed"
                  value="Administrador del sistema"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (user?.role === 'COMPANY') {
    return (
      <>
        <PageMeta title={user?.name ? `Panel de ${user.name}` : 'Perfil de Empresa'} description="Gestioná la información pública de tu organización en Red de Bienestar Laboral." />
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Perfil de Empresa</h1>
            <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">Gestiona la información pública de tu organización</p>
          </div>
        <CompanyProfileForm
          companyForm={companyForm}
          onChange={(field: string, value: string) => setCompanyForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleSaveBasic}
          saving={saving}
        />
      </div>
    </>
  );
  }

  return (
    <>
      <PageMeta title={user?.name ? `Mi Perfil — ${user.name}` : 'Mi Perfil Profesional'} description="Completá tu portafolio profesional en Red de Bienestar Laboral." />
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Perfil Profesional</h1>
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">Completa tu portafolio para mejorar tus oportunidades y visibilidad</p>
        </div>
        {profile && (
          <button
            onClick={() => navigate('/dashboard/cv-preview', { state: { profile } })}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#7B9E6B] hover:bg-[#6b8c5c] text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm self-start sm:self-auto shrink-0"
          >
            <Eye className="w-4 h-4" />
            Ver CV Vivo
          </button>
        )}
      </div>

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {activeTab === 'basic' && (
          <BasicInfoForm
            basicForm={basicForm}
            onChange={(field: string, value: string | number) => setBasicForm((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleSaveBasic}
            saving={saving}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceSection
            experience={profile?.experience ?? []}
            onAdd={handleAddExperience}
            onDelete={handleDeleteExperience}
            saving={saving}
          />
        )}

        {activeTab === 'education' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EducationSection
              education={profile?.education ?? []}
              onAdd={handleAddEducation}
              onDelete={handleDeleteEducation}
              saving={saving}
            />
            <CertificationsSection
              certifications={profile?.certifications ?? []}
              onAdd={handleAddCertification}
              onDelete={handleDeleteCertification}
              saving={saving}
            />
          </div>
        )}

        {activeTab === 'languages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <LanguagesSection
                languages={profile?.languages ?? []}
                onAdd={handleAddLanguage}
                onDelete={handleDeleteLanguage}
                saving={saving}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <SkillsSection skills={profile?.skills ?? []} />
            </div>
          </div>
        )}

        {confirmDelete && (
          <ConfirmDialog
            open={!!confirmDelete}
            title={confirmDelete.title}
            message={confirmDelete.message}
            confirmLabel="Eliminar"
            onConfirm={async () => {
              await confirmDelete.onConfirm(confirmDelete.id);
              setConfirmDelete(null);
            }}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </div>
    </div>
    </>
  );
}
