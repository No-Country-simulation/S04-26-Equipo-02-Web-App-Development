import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as profileApi from '../../api/profiles';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import { Loader2, Eye } from 'lucide-react';
import type { ProfessionalProfile, BasicFormState, CompanyFormState } from '../../components/dashboard/profile/types';
import CompanyProfileForm from '../../components/dashboard/profile/CompanyProfileForm';
import ProfileTabs from '../../components/dashboard/profile/ProfileTabs';
import BasicInfoForm from '../../components/dashboard/profile/BasicInfoForm';
import ExperienceSection from '../../components/dashboard/profile/ExperienceSection';
import EducationSection from '../../components/dashboard/profile/EducationSection';
import CertificationsSection from '../../components/dashboard/profile/CertificationsSection';
import LanguagesSection from '../../components/dashboard/profile/LanguagesSection';
import SkillsSection from '../../components/dashboard/profile/SkillsSection';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'languages'>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);

  const [basicForm, setBasicForm] = useState<BasicFormState>({
    firstName: '', lastName: '', professionalTitle: '', valueProposition: '',
    yearsOfExperience: 0, phone: '', location: '', bio: '', linkedinUrl: '',
    portfolioUrl: '', availability: 'AVAILABLE', preferredModality: 'REMOTE', salaryExpectation: '',
  });

  const [companyForm, setCompanyForm] = useState<CompanyFormState>(() => {
    const storedEmail = localStorage.getItem('auth_user_email');
    const storedRole = localStorage.getItem('auth_user_role');
    if (storedRole === 'COMPANY' && storedEmail) {
      const stored = localStorage.getItem(`company_profile_${storedEmail}`);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    return { companyName: '', industry: 'Tecnología', website: '', description: 'Red de Bienestar Corporativo y Gestión de Equipos.', location: 'Buenos Aires, Argentina' };
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
      }
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    if (user?.role === 'PROFESSIONAL') {
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
        localStorage.setItem(`company_profile_${user?.email}`, JSON.stringify(companyForm));
        toast.success('¡Perfil de empresa guardado con éxito!');
        updateUser({ name: companyForm.companyName });
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
    if (!confirm('¿Estás seguro de eliminar esta experiencia laboral?')) return;
    try {
      await profileApi.deleteExperience(id);
      toast.success('Experiencia eliminada correctamente');
      loadProfile();
    } catch (err) { toast.error(handleApiError(err).message); }
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
    if (!confirm('¿Estás seguro de eliminar esta formación educativa?')) return;
    try {
      await profileApi.deleteEducation(id);
      toast.success('Educación eliminada correctamente');
      loadProfile();
    } catch (err) { toast.error(handleApiError(err).message); }
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
    if (!confirm('¿Estás seguro de eliminar esta certificación?')) return;
    try {
      await profileApi.deleteCertification(id);
      toast.success('Certificación eliminada correctamente');
      loadProfile();
    } catch (err) { toast.error(handleApiError(err).message); }
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
    if (!confirm('¿Estás seguro de eliminar este idioma?')) return;
    try {
      await profileApi.deleteLanguage(id);
      toast.success('Idioma eliminado correctamente');
      loadProfile();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7B9E6B] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'COMPANY') {
    return (
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
    );
  }

  return (
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
      </div>
    </div>
  );
}
