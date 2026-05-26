import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageMeta } from '../../hooks/useMeta';
import * as profileApi from '../../api/profiles';
import { formatDate, type ProfessionalProfile } from '../../components/dashboard/profile/types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/errors';
import {
  ArrowLeft,
  Printer,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Languages,
  CheckCircle2,
  DollarSign,
  User,
  Loader2,
  ExternalLink
} from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);


export default function CvPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<ProfessionalProfile | null>(
    (location.state as { profile?: ProfessionalProfile } | null)?.profile || null
  );
  const [loading, setLoading] = useState(!profile);

  useEffect(() => {
    if (!profile) {
      const fetchProfile = async () => {
        try {
          const data = await profileApi.getMyProfile();
          setProfile(data);
        } catch (err) {
          toast.error(handleApiError(err).message || 'No se pudo cargar el perfil profesional.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [profile]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F5F0E8]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7B9E6B] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Cargando CV Vivo...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Perfil No Encontrado</h2>
        <p className="text-gray-500 text-sm">
          No pudimos encontrar la información del perfil profesional. Asegúrate de rellenar tus datos primero.
        </p>
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="px-6 py-2.5 bg-[#7B9E6B] text-white font-bold rounded-xl hover:bg-[#6b8c5c] transition-all"
        >
          Volver a Mi Perfil
        </button>
      </div>
    );
  }

  // Agrupar habilidades por categoría
  const skillsByCategory = profile.skills?.reduce((acc, ps) => {
    const category = ps.skill.category || 'Otras Habilidades';
    if (!acc[category]) acc[category] = [];
    acc[category].push(ps);
    return acc;
  }, {} as Record<string, typeof profile.skills>) || {};

  // Formatear disponibilidad
  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return { label: 'Disponible para ofertas', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'IN_PROCESS':
        return { label: 'En procesos de selección', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'NOT_AVAILABLE':
        return { label: 'No disponible actualmente', color: 'bg-gray-100 text-gray-800 border-gray-200' };
      default:
        return { label: 'No especificado', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case 'REMOTE':
        return 'Remoto';
      case 'HYBRID':
        return 'Híbrido';
      case 'ON_SITE':
        return 'Presencial';
      default:
        return modality || 'No especificado';
    }
  };

  const availabilityInfo = getAvailabilityLabel(profile.availability);
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-left">
      <PageMeta
        title={user?.name ? `CV — ${user.name}` : 'CV Vivo'}
        description="Vista previa de tu currículum profesional en Red de Bienestar Laboral."
      />
      {/* Botones de Acción - Ocultos en impresión */}
      <div className="flex justify-between items-center no-print">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7B9E6B] hover:bg-[#6b8c5c] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
        >
          <Printer className="w-4 h-4" />
          Descargar PDF / Imprimir
        </button>
      </div>

      {/* Hoja del CV */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Cabecera Premium */}
        <div className="bg-gradient-to-r from-[#7B9E6B] to-[#5F854F] px-8 py-10 md:px-12 text-white relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              {/* Avatar con Iniciales */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-inner text-2xl md:text-3xl font-black text-white shrink-0">
                {initials || <User className="w-10 h-10 md:w-12 md:h-12" />}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-white/90 text-md md:text-lg font-bold">
                  {profile.professionalTitle || 'Profesional'}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80 text-xs md:text-sm font-semibold">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.location}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {profile.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email || 'Contacto'}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges de Estado */}
            <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${availabilityInfo.color}`}>
                {availabilityInfo.label}
              </span>
              {profile.yearsOfExperience !== null && profile.yearsOfExperience > 0 && (
                <span className="px-4 py-1.5 bg-white/15 border border-white/20 rounded-full text-xs font-bold">
                  {profile.yearsOfExperience} años de experiencia
                </span>
              )}
            </div>
          </div>
          {/* Decoración geométrica sutil en el fondo de la cabecera */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none skew-x-12 transform origin-bottom-right" />
        </div>

        {/* Cuerpo del CV */}
        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10 print:grid-cols-3 print:gap-10">
          
          {/* Columna Lateral Izquierda (1/3) */}
          <div className="lg:col-span-1 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8 print:col-span-1 print:border-r print:border-b-0 print:pb-0 print:pr-8">
            
            {/* Detalles de Empleo */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#5F854F] uppercase tracking-widest">Información Clave</h3>
              <div className="space-y-3">
                <div className="bg-[#F5F0E8]/40 border border-[#F5F0E8] rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Modalidad Preferida</span>
                    <span className="text-sm font-bold text-gray-800">{getModalityLabel(profile.preferredModality)}</span>
                  </div>
                  {profile.salaryExpectation && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pretensión Salarial</span>
                      <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {profile.salaryExpectation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enlaces Profesionales */}
            {(profile.linkedinUrl || profile.portfolioUrl) && (
              <div className="space-y-4">
                <h3 className="text-xs font-black text-[#5F854F] uppercase tracking-widest">Enlaces</h3>
                <div className="space-y-2">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700 hover:text-blue-700 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <LinkedinIcon className="w-4 h-4 text-blue-600" />
                        LinkedIn
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 no-print" />
                    </a>
                  )}
                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700 hover:text-[#7B9E6B] transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-600" />
                        Portfolio / Web
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 no-print" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Idiomas */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800">
                  <Languages className="w-4 h-4 text-[#7B9E6B]" />
                  <h3 className="text-xs font-black text-[#5F854F] uppercase tracking-widest">Idiomas</h3>
                </div>
                <div className="space-y-2">
                  {profile.languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm font-bold text-gray-800">{lang.name}</span>
                      <span className="text-xs font-black text-[#7B9E6B] bg-white border border-[#7B9E6B]/20 px-2 py-0.5 rounded-md">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Habilidades Validadas */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#7B9E6B]" />
                  <h3 className="text-xs font-black text-[#5F854F] uppercase tracking-widest">Habilidades</h3>
                </div>
                <div className="space-y-5">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="space-y-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((ps) => (
                          <span
                            key={ps.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              ps.isVerified
                                ? 'bg-[#7B9E6B]/10 text-[#5F854F] border-[#7B9E6B]/30'
                                : 'bg-gray-50 text-gray-600 border-gray-100'
                            }`}
                          >
                            {ps.skill.name}
                            {ps.isVerified && <CheckCircle2 className="w-3 h-3 text-[#7B9E6B] shrink-0" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna Principal Derecha (2/3) */}
          <div className="lg:col-span-2 space-y-10 print:col-span-2">
            
            {/* Propuesta de Valor y Biografía */}
            {profile.valueProposition && (
              <div className="space-y-4">
                <h3 className="text-xs font-black text-[#5F854F] uppercase tracking-widest">Propuesta de Valor</h3>
                <p className="text-lg font-black text-gray-900 leading-snug">
                  "{profile.valueProposition}"
                </p>
                {profile.bio && (
                  <p className="text-sm font-medium text-gray-500 leading-relaxed whitespace-pre-line pt-2">
                    {profile.bio}
                  </p>
                )}
              </div>
            )}

            {/* Experiencia Laboral */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Briefcase className="w-5 h-5 text-[#7B9E6B]" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Experiencia Laboral</h3>
              </div>
              
              {profile.experience && profile.experience.length > 0 ? (
                <div className="relative border-l border-gray-100 pl-6 ml-3 space-y-8">
                  {profile.experience.map((exp) => (
                    <div key={exp.id} className="relative space-y-2">
                      {/* Nodo indicador en la línea de tiempo */}
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#7B9E6B] border-2 border-white ring-4 ring-gray-50" />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <div>
                          <h4 className="text-md font-black text-gray-800 leading-tight">{exp.role}</h4>
                          <span className="text-sm font-bold text-gray-500">{exp.company}</span>
                        </div>
                        <span className="text-xs font-black text-gray-400 whitespace-nowrap bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md self-start md:self-center">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Presente'}
                        </span>
                      </div>
                      
                      {exp.description && (
                        <p className="text-sm font-semibold text-gray-400 leading-relaxed whitespace-pre-line pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No se ha registrado experiencia laboral.</p>
              )}
            </div>

            {/* Formación Académica */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <BookOpen className="w-5 h-5 text-[#7B9E6B]" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Formación Académica</h3>
              </div>

              {profile.education && profile.education.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-black text-white bg-[#7B9E6B] px-2 py-0.5 rounded-md">
                          {edu.year}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-gray-800 leading-tight">{edu.degree}</h4>
                      <p className="text-xs font-bold text-gray-500">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No se ha registrado educación académica.</p>
              )}
            </div>

            {/* Certificaciones */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Award className="w-5 h-5 text-[#7B9E6B]" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Certificaciones</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-800 leading-tight">{cert.name}</h4>
                        <p className="text-xs font-bold text-gray-500">{cert.issuer}</p>
                        {cert.issueDate && (
                          <span className="text-[10px] text-gray-400 font-bold block pt-1">
                            Emitido: {formatDate(cert.issueDate)}
                          </span>
                        )}
                      </div>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-black text-[#7B9E6B] hover:text-[#5F854F] mt-2 no-print self-start"
                        >
                          Ver Credencial
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Bloque CSS para Impresión */}
      <style>{`
        @media print {
          /* Ocultar elementos de interfaz que no pertenecen al documento CV */
          .no-print,
          aside,
          nav,
          header,
          button,
          [class*="sidebar"],
          [class*="Sidebar"],
          .fixed {
            display: none !important;
          }

          /* Forzar a todos los elementos contenedores de la app a ocupar 100% de ancho y permitir scroll/impresión */
          body,
          html,
          #root,
          div[style*="--sidebar-width"],
          main,
          main > div,
          main > div > div {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Fondo e impresión del texto */
          body {
            background-color: white !important;
            color: #1A1A1A !important;
          }

          /* Mantener colores de fondo exactos (gradientes, badges) en el PDF */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
