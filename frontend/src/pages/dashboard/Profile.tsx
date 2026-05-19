import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import { API_ENDPOINTS } from '../../lib/constants';
import { toast } from 'sonner';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Save, 
  Plus, 
  Trash2, 
  MapPin, 
  Phone, 
  Link2,
  Calendar,
  Building2,
  Globe,
  FileText,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Types matching backend
interface ProfileSkill {
  id: string;
  isVerified: boolean;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  url: string | null;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

interface ProfessionalProfile {
  id: string;
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  valueProposition: string | null;
  yearsOfExperience: number | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  availability: 'AVAILABLE' | 'IN_PROCESS' | 'NOT_AVAILABLE';
  preferredModality: 'REMOTE' | 'ON_SITE' | 'HYBRID';
  salaryExpectation: string | null;
  completionScore: number;
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  skills: ProfileSkill[];
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'languages'>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);

  // Forms states
  const [basicForm, setBasicForm] = useState({
    firstName: '',
    lastName: '',
    professionalTitle: '',
    valueProposition: '',
    yearsOfExperience: 0,
    phone: '',
    location: '',
    bio: '',
    linkedinUrl: '',
    portfolioUrl: '',
    availability: 'AVAILABLE',
    preferredModality: 'REMOTE',
    salaryExpectation: '',
  });

  // Modals / Item Add state
  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });

  const [showEduForm, setShowEduForm] = useState(false);
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    year: new Date().getFullYear(),
  });

  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    url: '',
  });

  const [showLangForm, setShowLangForm] = useState(false);
  const [langForm, setLangForm] = useState({
    name: '',
    level: 'B2 - Avanzado',
  });

  // Company Profile states (persisted in localStorage for demo)
  const [companyForm, setCompanyForm] = useState(() => {
    const storedEmail = localStorage.getItem('auth_user_email');
    const storedRole = localStorage.getItem('auth_user_role');
    if (storedRole === 'COMPANY' && storedEmail) {
      const stored = localStorage.getItem(`company_profile_${storedEmail}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return {
      companyName: '',
      industry: 'Tecnología',
      website: '',
      description: 'Red de Bienestar Corporativo y Gestión de Equipos.',
      location: 'Buenos Aires, Argentina',
    };
  });

  // Cargar perfil
  const loadProfile = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'PROFESSIONAL') {
        const res = await api.get(`${API_ENDPOINTS.profiles}/me`);
        if (res.data && res.data.success) {
          const data = res.data.data as ProfessionalProfile;
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
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Error al cargar datos del perfil');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    if (user?.role === 'PROFESSIONAL') {
      // Defer calling loadProfile to avoid synchronous setState calls in effect body
      Promise.resolve().then(() => {
        if (active) {
          loadProfile();
        }
      });
    } else {
      // Defer state setting to avoid cascading renders warning in development
      Promise.resolve().then(() => {
        if (active) {
          setLoading(false);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [user, loadProfile]);

  // Guardar datos básicos
  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user?.role === 'PROFESSIONAL') {
        const payload = {
          ...basicForm,
          yearsOfExperience: Number(basicForm.yearsOfExperience),
        };
        const res = await api.patch(`${API_ENDPOINTS.profiles}/update`, payload);
        if (res.data && res.data.success) {
          toast.success('¡Información de perfil actualizada!');
          updateUser({ 
            name: `${basicForm.firstName} ${basicForm.lastName}`.trim(),
            firstName: basicForm.firstName,
            lastName: basicForm.lastName
          });
          loadProfile();
        }
      } else {
        localStorage.setItem(`company_profile_${user?.email}`, JSON.stringify(companyForm));
        toast.success('¡Perfil de empresa guardado con éxito!');
        updateUser({ name: companyForm.companyName });
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al guardar los datos');
    } finally {
      setSaving(false);
    }
  };

  // Agregar Experiencia
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        company: expForm.company,
        role: expForm.role,
        startDate: new Date(expForm.startDate).toISOString(),
        endDate: expForm.isCurrent || !expForm.endDate ? null : new Date(expForm.endDate).toISOString(),
        description: expForm.description || undefined,
      };
      await api.post(`${API_ENDPOINTS.profiles}/experience`, payload);
      toast.success('Experiencia agregada correctamente');
      setShowExpForm(false);
      setExpForm({ company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '' });
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al agregar experiencia');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta experiencia laboral?')) return;
    try {
      await api.delete(`${API_ENDPOINTS.profiles}/experience/${id}`);
      toast.success('Experiencia eliminada correctamente');
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar experiencia');
    }
  };

  // Agregar Educación
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        institution: eduForm.institution,
        degree: eduForm.degree,
        year: Number(eduForm.year),
      };
      await api.post(`${API_ENDPOINTS.profiles}/education`, payload);
      toast.success('Educación agregada correctamente');
      setShowEduForm(false);
      setEduForm({ institution: '', degree: '', year: new Date().getFullYear() });
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al agregar educación');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta formación educativa?')) return;
    try {
      await api.delete(`${API_ENDPOINTS.profiles}/education/${id}`);
      toast.success('Educación eliminada correctamente');
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar educación');
    }
  };

  // Agregar Certificación
  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: certForm.name,
        issuer: certForm.issuer,
        issueDate: certForm.issueDate ? new Date(certForm.issueDate).toISOString() : null,
        url: certForm.url || null,
      };
      await api.post(`${API_ENDPOINTS.profiles}/certifications`, payload);
      toast.success('Certificación agregada correctamente');
      setShowCertForm(false);
      setCertForm({ name: '', issuer: '', issueDate: '', url: '' });
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al agregar certificación');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta certificación?')) return;
    try {
      await api.delete(`${API_ENDPOINTS.profiles}/certifications/${id}`);
      toast.success('Certificación eliminada correctamente');
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar certificación');
    }
  };

  // Agregar Idioma
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`${API_ENDPOINTS.profiles}/languages`, langForm);
      toast.success('Idioma agregado correctamente');
      setShowLangForm(false);
      setLangForm({ name: '', level: 'B2 - Avanzado' });
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al agregar idioma');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este idioma?')) return;
    try {
      await api.delete(`${API_ENDPOINTS.profiles}/languages/${id}`);
      toast.success('Idioma eliminado correctamente');
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar idioma');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
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

  // --- RENDER COMPANY PROFILE ---
  if (user?.role === 'COMPANY') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 text-left">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Perfil de Empresa</h1>
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
            Gestiona la información pública de tu organización
          </p>
        </div>

        <form onSubmit={handleSaveBasic} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre de la Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={companyForm.companyName}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rubro / Industria</label>
              <input 
                type="text" 
                value={companyForm.industry}
                onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sitio Web</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="url" 
                  placeholder="https://miempresa.com"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descripción de la Empresa</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                <textarea 
                  rows={4}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#7B9E6B] hover:bg-[#6b8c5c] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Perfil</>}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER PROFESSIONAL PROFILE ---
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-left">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Perfil Profesional</h1>
        <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest">
          Completa tu portafolio para mejorar tus oportunidades y visibilidad
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-6">
        {[
          { id: 'basic', label: 'Info Básica', icon: User },
          { id: 'experience', label: 'Experiencia', icon: Briefcase },
          { id: 'education', label: 'Educación y Certificaciones', icon: GraduationCap },
          { id: 'languages', label: 'Idiomas y Habilidades', icon: Languages },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'basic' | 'experience' | 'education' | 'languages')}
            className={`flex items-center gap-2 pb-4 px-1 font-bold text-sm border-b-2 transition-all whitespace-nowrap outline-none ${
              activeTab === tab.id 
                ? 'border-[#7B9E6B] text-[#7B9E6B]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'basic' && (
          <form onSubmit={handleSaveBasic} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</label>
                <input 
                  type="text" 
                  value={basicForm.firstName}
                  onChange={(e) => setBasicForm({ ...basicForm, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Apellido</label>
                <input 
                  type="text" 
                  value={basicForm.lastName}
                  onChange={(e) => setBasicForm({ ...basicForm, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título Profesional (Ej: Consultor Sr en Operaciones)</label>
                <input 
                  type="text" 
                  value={basicForm.professionalTitle}
                  onChange={(e) => setBasicForm({ ...basicForm, professionalTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Años de Experiencia</label>
                <input 
                  type="number" 
                  value={basicForm.yearsOfExperience}
                  onChange={(e) => setBasicForm({ ...basicForm, yearsOfExperience: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    value={basicForm.phone}
                    onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={basicForm.location}
                    onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL de LinkedIn</label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="https://linkedin.com/in/tu-perfil"
                    value={basicForm.linkedinUrl}
                    onChange={(e) => setBasicForm({ ...basicForm, linkedinUrl: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL de Portfolio / Web</label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="https://tu-web.com"
                    value={basicForm.portfolioUrl}
                    onChange={(e) => setBasicForm({ ...basicForm, portfolioUrl: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Disponibilidad Laboral</label>
                <select 
                  value={basicForm.availability}
                  onChange={(e) => setBasicForm({ ...basicForm, availability: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-[#1A1A1A] h-12"
                >
                  <option value="AVAILABLE">Disponible para ofertas</option>
                  <option value="IN_PROCESS">En procesos de selección</option>
                  <option value="NOT_AVAILABLE">No disponible actualmente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferencia de Modalidad</label>
                <select 
                  value={basicForm.preferredModality}
                  onChange={(e) => setBasicForm({ ...basicForm, preferredModality: e.target.value as 'REMOTE' | 'HYBRID' | 'ON_SITE' })}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-[#1A1A1A] h-12"
                >
                  <option value="REMOTE">Remoto</option>
                  <option value="HYBRID">Híbrido</option>
                  <option value="ON_SITE">Presencial</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Propuesta de Valor (Resumen breve)</label>
                <textarea 
                  value={basicForm.valueProposition}
                  onChange={(e) => setBasicForm({ ...basicForm, valueProposition: e.target.value })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biografía Completa</label>
                <textarea 
                  value={basicForm.bio}
                  onChange={(e) => setBasicForm({ ...basicForm, bio: e.target.value })}
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 bg-[#F5F0E8]/50 border border-gray-100 rounded-xl focus:border-[#7B9E6B] focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
                />
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-[#7B9E6B] hover:bg-[#6b8c5c] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
              <div>
                <h3 className="font-black text-gray-900">Historial Laboral</h3>
                <p className="text-xs text-gray-400 mt-1">Registra los cargos más relevantes que has tenido</p>
              </div>
              <button
                onClick={() => setShowExpForm(!showExpForm)}
                className="px-4 py-2.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs hover:bg-[#6b8c5c] transition-all flex items-center gap-1.5 shadow-md shadow-green-700/10"
              >
                <Plus className="w-4 h-4" /> Agregar Cargo
              </button>
            </div>

            {/* Formulario Agregar Cargo */}
            {showExpForm && (
              <form onSubmit={handleAddExperience} className="bg-white border-2 border-[#7B9E6B]/30 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Nuevo Cargo Laboral</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Empresa</label>
                    <input 
                      type="text" 
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Cargo / Rol</label>
                    <input 
                      type="text" 
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      value={expForm.startDate}
                      onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Fin</label>
                    <input 
                      type="date" 
                      value={expForm.endDate}
                      onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                      disabled={expForm.isCurrent}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800 disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="isCurrent"
                      checked={expForm.isCurrent}
                      onChange={(e) => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                      className="w-4 h-4 rounded text-[#7B9E6B] focus:ring-[#7B9E6B]"
                    />
                    <label htmlFor="isCurrent" className="text-xs font-bold text-gray-500 cursor-pointer">Trabajo actualmente aquí</label>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción / Logros principales</label>
                    <textarea 
                      rows={3}
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowExpForm(false)} 
                    className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="px-5 py-2 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs hover:bg-[#6b8c5c] shadow-sm"
                  >
                    {saving ? 'Guardando...' : 'Guardar Cargo'}
                  </button>
                </div>
              </form>
            )}

            {/* Listado de Experiencia */}
            <div className="space-y-4">
              {profile && profile.experience.length > 0 ? (
                profile.experience.map((exp) => (
                  <div key={exp.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-all group">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#EDE8DB] flex items-center justify-center text-[#7B9E6B] shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 text-base leading-snug">{exp.role}</h4>
                        <p className="text-[#7B9E6B] font-bold text-sm">{exp.company}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Actualidad'}</p>
                        {exp.description && (
                          <p className="text-xs text-gray-500 font-medium leading-relaxed pt-2 max-w-2xl">{exp.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400 shadow-sm font-semibold">
                  No has registrado cargos laborales aún. Haz clic en "Agregar Cargo".
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* EDUCACIÓN */}
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-black text-gray-900">Formación</h3>
                  <p className="text-xs text-gray-400 mt-1">Títulos y grados académicos</p>
                </div>
                <button
                  onClick={() => setShowEduForm(!showEduForm)}
                  className="px-4 py-2.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs hover:bg-[#6b8c5c] transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>

              {showEduForm && (
                <form onSubmit={handleAddEducation} className="bg-white border-2 border-[#7B9E6B]/30 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs">Nueva Formación</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Institución</label>
                      <input 
                        type="text" 
                        value={eduForm.institution}
                        onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Título / Certificación Obtenida</label>
                      <input 
                        type="text" 
                        value={eduForm.degree}
                        onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Año de Egreso</label>
                      <input 
                        type="number" 
                        value={eduForm.year}
                        onChange={(e) => setEduForm({ ...eduForm, year: Number(e.target.value) })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowEduForm(false)} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
                    <button type="submit" disabled={saving} className="px-4 py-1.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs">Guardar</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {profile && profile.education.length > 0 ? (
                  profile.education.map((edu) => (
                    <div key={edu.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{edu.degree}</h4>
                          <p className="text-gray-500 text-xs">{edu.institution} · <span className="font-semibold text-gray-400">{edu.year}</span></p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteEducation(edu.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm border border-gray-100">Sin títulos académicos registrados.</div>
                )}
              </div>
            </div>

            {/* CERTIFICACIONES */}
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-black text-gray-900">Certificaciones</h3>
                  <p className="text-xs text-gray-400 mt-1">Cursos, licencias y diplomas certificados</p>
                </div>
                <button
                  onClick={() => setShowCertForm(!showCertForm)}
                  className="px-4 py-2.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs hover:bg-[#6b8c5c] transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>

              {showCertForm && (
                <form onSubmit={handleAddCertification} className="bg-white border-2 border-[#7B9E6B]/30 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs">Nueva Certificación</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre de la Certificación</label>
                      <input 
                        type="text" 
                        value={certForm.name}
                        onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Emisor / Certificador</label>
                      <input 
                        type="text" 
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Expedición</label>
                      <input 
                        type="date" 
                        value={certForm.issueDate}
                        onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">URL de Verificación (Opcional)</label>
                      <input 
                        type="url" 
                        value={certForm.url}
                        onChange={(e) => setCertForm({ ...certForm, url: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowCertForm(false)} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
                    <button type="submit" disabled={saving} className="px-4 py-1.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs">Guardar</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {profile && profile.certifications.length > 0 ? (
                  profile.certifications.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{cert.name}</h4>
                          <p className="text-gray-500 text-xs">{cert.issuer} {cert.issueDate && `· ${formatDate(cert.issueDate)}`}</p>
                          {cert.url && (
                            <a href={cert.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#7B9E6B] hover:underline flex items-center gap-0.5 mt-0.5">Ver certificado <Link2 className="w-3 h-3" /></a>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteCertification(cert.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm border border-gray-100">Sin certificaciones registradas.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'languages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* IDIOMAS */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex justify-between items-center bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
                <div>
                  <h3 className="font-black text-gray-900">Idiomas</h3>
                  <p className="text-xs text-gray-400 mt-1">Idiomas que dominas</p>
                </div>
                <button
                  onClick={() => setShowLangForm(!showLangForm)}
                  className="px-3.5 py-2 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs hover:bg-[#6b8c5c] transition-all flex items-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>

              {showLangForm && (
                <form onSubmit={handleAddLanguage} className="bg-white border-2 border-[#7B9E6B]/30 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs">Nuevo Idioma</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Idioma (Ej: Inglés)</label>
                      <input 
                        type="text" 
                        value={langForm.name}
                        onChange={(e) => setLangForm({ ...langForm, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Nivel</label>
                      <select 
                        value={langForm.level}
                        onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-[#1a1a1a] h-10"
                      >
                        <option value="A1 - Básico">A1 - Básico</option>
                        <option value="A2 - Básico Superior">A2 - Básico Superior</option>
                        <option value="B1 - Intermedio">B1 - Intermedio</option>
                        <option value="B2 - Avanzado">B2 - Avanzado</option>
                        <option value="C1 - Profesional Eficaz">C1 - Profesional Eficaz</option>
                        <option value="C2 - Maestría / Nativo">C2 - Maestría / Nativo</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowLangForm(false)} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
                    <button type="submit" disabled={saving} className="px-4 py-1.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs">Guardar</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {profile && profile.languages.length > 0 ? (
                  profile.languages.map((lang) => (
                    <div key={lang.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center group">
                      <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">{lang.name}</p>
                        <span className="text-[10px] font-bold text-[#7B9E6B] uppercase tracking-wider">{lang.level}</span>
                      </div>
                      <button onClick={() => handleDeleteLanguage(lang.id)} className="text-gray-300 hover:text-red-500 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-6 text-center text-gray-400 text-xs border border-gray-100">Sin idiomas registrados.</div>
                )}
              </div>
            </div>

            {/* SKILLS DE COMPETENCIA */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm text-left">
                <h3 className="font-black text-gray-900">Habilidades</h3>
                <p className="text-xs text-gray-400 mt-1">Habilidades certificadas mediante las evaluaciones de autodiagnóstico.</p>
                
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {profile && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <span 
                        key={skill.id}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                          skill.isVerified 
                            ? 'bg-[#7B9E6B]/10 text-[#7B9E6B] border-[#7B9E6B]/20 shadow-sm' 
                            : 'bg-[#EDE8DB] text-gray-600 border-transparent'
                        }`}
                      >
                        {skill.skill.name}
                        {skill.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#7B9E6B]" />}
                      </span>
                    ))
                  ) : (
                    <div className="w-full text-center py-6">
                      <p className="text-xs font-semibold text-gray-400">Completa el autodiagnóstico inicial para validar tus competencias y ver tus habilidades aquí.</p>
                      <Link to="/dashboard" className="inline-block mt-4 text-xs font-bold text-[#7B9E6B] hover:underline">Ir a Dashboard</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
