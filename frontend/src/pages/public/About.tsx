import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageMeta } from '../../hooks/useMeta';
import { 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Database,
  Terminal,
  ArrowRight,
  GitBranch,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Endpoint {
  id: string;
  module: 'Auth' | 'Profiles' | 'Company' | 'Diagnostic' | 'Learning' | 'Hiring/Jobs' | 'Talent/Preselection' | 'Events' | 'Stats';
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  purpose: string;
  status: 'CONNECTED' | 'MISSING' | 'MISMATCH' | 'LOCALSTORAGE' | 'BRANCH_READY';
  statusLabel: string;
  backendState: string;
  adaptation: string;
  focus: 'BACKEND' | 'FRONTEND' | 'MERGE' | 'NONE';
  reqBody?: string;
  resBody?: string;
}

const ENDPOINTS_DATA: Endpoint[] = [
  // Auth
  {
    id: 'auth-1',
    module: 'Auth',
    method: 'POST',
    path: '/api/v1/auth/login',
    purpose: 'Iniciar sesión y establecer cookies token y refreshToken.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado en backend y consumido.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    reqBody: `{
  "email": "usuario@test.com",
  "password": "password123",
  "provider": "PROFESSIONAL" // o COMPANY
}`,
    resBody: `{
  "message": "Login exitoso"
} // Establece cookies: token, refreshToken`
  },
  {
    id: 'auth-2',
    module: 'Auth',
    method: 'POST',
    path: '/api/v1/auth/register',
    purpose: 'Registro de nuevos usuarios (Profesionales/Empresas).',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado en backend y consumido.',
    adaptation: 'Nota: En la rama `feature/company-profile-endpoints` se agregó la creación automática de CompanyProfile para el rol COMPANY en este flujo.',
    focus: 'NONE',
    reqBody: `{
  "email": "nuevo@test.com",
  "password": "password123",
  "provider": "PROFESSIONAL",
  "firstName": "Juan",
  "lastName": "Pérez",
  "location": "Mendoza",
  "phone": "261000000"
}`,
    resBody: `{
  "message": "Usuario registrado correctamente"
}`
  },
  {
    id: 'auth-3',
    module: 'Auth',
    method: 'PATCH',
    path: '/api/v1/auth/verify-email/:token',
    purpose: 'Verificar email mediante token de activación.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    resBody: `{
  "message": "Email verificado correctamente"
}`
  },
  {
    id: 'auth-4',
    module: 'Auth',
    method: 'GET',
    path: '/api/v1/auth/validate-session',
    purpose: 'Validar sesión activa en base a las cookies HttpOnly.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y utilizado por el AuthStore al iniciar la app.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    resBody: `{
  "message": "Sesión válida"
}`
  },
  {
    id: 'auth-5',
    module: 'Auth',
    method: 'PATCH',
    path: '/api/v1/auth/logout',
    purpose: 'Cerrar sesión limpiando las cookies HttpOnly e invalidando la sesión en la base de datos.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (logoutController) como PATCH /logout.',
    adaptation: 'Fusionar la rama gonza-dev para habilitar el endpoint de logout.',
    focus: 'MERGE',
    resBody: `{
  "success": true,
  "message": "Logout exitoso"
}`
  },
  // Profiles
  {
    id: 'prof-1',
    module: 'Profiles',
    method: 'GET',
    path: '/api/v1/profiles/me',
    purpose: 'Obtener perfil completo del profesional autenticado.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y en uso.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    resBody: `{
  "success": true,
  "data": {
    "id": "prof-uuid-1",
    "firstName": "Juan",
    "lastName": "Pérez",
    "skills": [...],
    "experience": [...],
    "education": [...]
  }
}`
  },
  {
    id: 'prof-2',
    module: 'Profiles',
    method: 'PATCH',
    path: '/api/v1/profiles/update',
    purpose: 'Actualizar campos básicos del profesional.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y en uso.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    reqBody: `{
  "professionalTitle": "Backend Engineer",
  "valueProposition": "Desarrollo escalable",
  "location": "Mendoza, Argentina",
  "bio": "Bio extendida..."
}`
  },
  {
    id: 'prof-3',
    module: 'Profiles',
    method: 'GET',
    path: '/api/v1/profiles/slug/:slug',
    purpose: 'Obtener perfil público por slug (para ver CVs o candidatos).',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y habilitado en la rama main.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    resBody: `{
  "success": true,
  "data": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "slug": "juan-perez",
    ...
  }
}`
  },
  {
    id: 'prof-4',
    module: 'Profiles',
    method: 'POST',
    path: '/api/v1/profiles/skills',
    purpose: 'Agregar una habilidad manualmente al perfil profesional.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y habilitado en la rama main (desarrollado en feature/profile-skills-manual).',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    reqBody: `{
  "skillId": "skill-uuid-1"
}`
  },
  {
    id: 'prof-5',
    module: 'Profiles',
    method: 'DELETE',
    path: '/api/v1/profiles/skills/:skillId',
    purpose: 'Eliminar una habilidad del perfil profesional.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y habilitado en la rama main (desarrollado en feature/profile-skills-manual).',
    adaptation: 'Ninguna.',
    focus: 'NONE'
  },
  // Company Profiles
  {
    id: 'comp-1',
    module: 'Company',
    method: 'GET',
    path: '/api/v1/profiles/company/me',
    purpose: 'Obtener los datos corporativos de la empresa autenticada.',
    status: 'MISMATCH',
    statusLabel: 'Falta en Frontend (Mock en Vista)',
    backendState: 'Implementado en backend (fusionado en main).',
    adaptation: 'Consumir los endpoints en el frontend y reemplazar el mock de LocalStorage en el perfil de empresa.',
    focus: 'FRONTEND',
    resBody: `{
  "success": true,
  "data": {
    "id": "comp-uuid-1",
    "companyName": "TechSolutions AR",
    "industry": "Tecnología",
    "description": "...",
    "website": "https://..."
  }
}`
  },
  {
    id: 'comp-2',
    module: 'Company',
    method: 'PATCH',
    path: '/api/v1/profiles/company/update',
    purpose: 'Actualizar nombre, industria, descripción, web de la empresa.',
    status: 'MISMATCH',
    statusLabel: 'Falta en Frontend (Mock en Vista)',
    backendState: 'Implementado en backend (fusionado en main).',
    adaptation: 'Consumir los endpoints en el frontend para actualizar los datos corporativos.',
    focus: 'FRONTEND',
    reqBody: `{
  "companyName": "TechSolutions AR Modificado",
  "industry": "Software",
  "website": "https://nuevapagina.com"
}`
  },
  // Diagnostic
  {
    id: 'diag-1',
    module: 'Diagnostic',
    method: 'GET',
    path: '/api/v1/diagnostic/skills',
    purpose: 'Obtener habilidades para la autoevaluación.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y consumido en la evaluación.',
    adaptation: 'Ninguna.',
    focus: 'NONE'
  },
  {
    id: 'diag-2',
    module: 'Diagnostic',
    method: 'POST',
    path: '/api/v1/diagnostic/submit',
    purpose: 'Guardar resultados del diagnóstico del profesional.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y en uso.',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    reqBody: `{
  "answers": [
    { "skillId": "skill-uuid-1", "score": 4 },
    { "skillId": "skill-uuid-2", "score": 3 }
  ]
}`
  },
  {
    id: 'diag-3',
    module: 'Diagnostic',
    method: 'GET',
    path: '/api/v1/diagnostic',
    purpose: 'Comprobar si el usuario ya realizó su diagnóstico y ver estado general.',
    status: 'CONNECTED',
    statusLabel: 'Conectado',
    backendState: 'Implementado y consumido (habilitado en la rama main).',
    adaptation: 'Ninguna.',
    focus: 'NONE',
    resBody: `{
  "success": true,
  "data": {
    "status": "completed",
    "timestamp": "2026-05-22T00:00:00Z"
  }
}`
  },
  // Learning
  {
    id: 'learn-1',
    module: 'Learning',
    method: 'GET',
    path: '/api/v1/learning/paths',
    purpose: 'Obtener módulos y cursos formativos.',
    status: 'MISMATCH',
    statusLabel: 'Falta en Frontend (Mock en Vista)',
    backendState: 'Implementado en el backend.',
    adaptation: 'Crear el archivo API learning.ts en el frontend, consumir el endpoint y reemplazar los mocks en Learning.tsx.',
    focus: 'FRONTEND',
    resBody: `{
  "success": true,
  "data": [
    {
      "id": "path-uuid",
      "title": "Habilidades Digitales Clave",
      "courses": [...]
    }
  ]
}`
  },
  {
    id: 'learn-2',
    module: 'Learning',
    method: 'GET',
    path: '/api/v1/learning/progress',
    purpose: 'Obtener el avance del profesional logueado en sus cursos.',
    status: 'MISMATCH',
    statusLabel: 'Falta en Frontend (Mock en Vista)',
    backendState: 'Implementado. Autogenera cursos sugeridos a partir del diagnóstico de menor puntaje.',
    adaptation: 'Consumir en el frontend para cargar los cursos asignados al profesional en lugar del listado estático.',
    focus: 'FRONTEND',
    resBody: `{
  "success": true,
  "data": [
    { "id": "prog-1", "courseId": "course-1", "status": "IN_PROGRESS" }
  ]
}`
  },
  {
    id: 'learn-3',
    module: 'Learning',
    method: 'POST',
    path: '/api/v1/learning/progress/:courseId',
    purpose: 'Actualizar avance en un curso (marcar como COMPLETADO).',
    status: 'MISMATCH',
    statusLabel: 'Falta en Frontend (Diferencia de Firma)',
    backendState: 'Implementado en backend recibiendo courseId en URL y status en Body. El frontend propuesto asume enviar courseId en Body.',
    adaptation: 'Al integrar la API en el frontend, enviar el ID del curso como parámetro URL de la petición.',
    focus: 'FRONTEND',
    reqBody: `{
  "status": "COMPLETED" // PENDING, IN_PROGRESS, COMPLETED
}`,
    resBody: `{
  "success": true,
  "data": { "courseId": "...", "status": "COMPLETED" }
} // Nota: Cambiar a COMPLETED verifica las habilidades en el perfil`
  },
  // Jobs
  {
    id: 'jobs-1',
    module: 'Hiring/Jobs',
    method: 'POST',
    path: '/api/v1/hiring/create-offer',
    purpose: 'Crear una oferta de empleo para la empresa.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (createOffer).',
    adaptation: 'Fusionar la rama gonza-dev para traer la lógica al backend main, y consumir en el formulario de nueva publicación.',
    focus: 'MERGE',
    reqBody: `{
  "title": "Senior Frontend Developer",
  "salaryRange": "$4.5M - $5.5M ARS",
  "contractType": "Tiempo Completo",
  "modality": "REMOTE", // REMOTE, ON_SITE, HYBRID
  "description": "Requisitos...",
  "education": "Universitario",
  "experience": "5+ años"
}`
  },
  {
    id: 'jobs-2',
    module: 'Hiring/Jobs',
    method: 'GET',
    path: '/api/v1/hiring/offers',
    purpose: 'Listar las ofertas laborales de la empresa.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (getOffers).',
    adaptation: 'Fusionar la rama gonza-dev para listar las ofertas laborales de la empresa en el frontend.',
    focus: 'MERGE',
    resBody: `{
  "success": true,
  "data": [
    { "id": "job-1", "title": "React Developer", "applicantCount": 12 }
  ]
}`
  },
  {
    id: 'jobs-3',
    module: 'Hiring/Jobs',
    method: 'PATCH',
    path: '/api/v1/hiring/update-offer',
    purpose: 'Editar campos de una vacante o su estado.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (updateOffer).',
    adaptation: 'Fusionar la rama gonza-dev para actualizar ofertas laborales de la empresa.',
    focus: 'MERGE',
    reqBody: `{
  "id": "job-uuid-123",
  "title": "React Dev Senior",
  "salaryRange": "$4.8M - $5.8M ARS"
}`
  },
  {
    id: 'jobs-4',
    module: 'Hiring/Jobs',
    method: 'DELETE',
    path: '/api/v1/hiring/delete-offer/:id',
    purpose: 'Eliminar una oferta de empleo.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (deleteOffer).',
    adaptation: 'Fusionar la rama gonza-dev para habilitar el borrado de ofertas desde Mis Publicaciones.',
    focus: 'MERGE'
  },
  {
    id: 'jobs-5',
    module: 'Hiring/Jobs',
    method: 'GET',
    path: '/api/v1/hiring/opportunities',
    purpose: 'Listar ofertas en el Marketplace para profesionales (Opportunities.tsx) con filtros.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (getOpportunities).',
    adaptation: 'Fusionar la rama gonza-dev y consumir en el Marketplace de oportunidades del frontend.',
    focus: 'MERGE',
    resBody: `{
  "success": true,
  "data": [
    { "id": "job-1", "company": "InnovaTech", "position": "UX", "matchScore": 88 }
  ]
}`
  },
  // Talent
  {
    id: 'talent-1',
    module: 'Talent/Preselection',
    method: 'GET',
    path: '/api/v1/hiring/search-candidates',
    purpose: 'Búsqueda avanzada de profesionales Seniors para empresas (TalentSearch.tsx).',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (searchCandidates).',
    adaptation: 'Fusionar la rama gonza-dev. El servicio cuenta con filtros avanzados de experiencia, título, habilidades e idiomas.',
    focus: 'MERGE',
    resBody: `{
  "success": true,
  "data": [
    { "id": "prof-1", "firstName": "Silvia", "skills": ["PMP", "Scrum"] }
  ]
}`
  },
  {
    id: 'talent-2',
    module: 'Talent/Preselection',
    method: 'POST',
    path: '/api/v1/hiring/preselection',
    purpose: 'Guardar candidato preseleccionado de interés para la empresa.',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (preselectionController).',
    adaptation: 'Fusionar la rama gonza-dev y consumir en la sección de preselección del frontend.',
    focus: 'MERGE',
    reqBody: `{
  "userId": "prof-uuid-1",
  "notes": "Excelente perfil"
}`,
    resBody: `{
  "success": true,
  "data": { "id": "presel-uuid-123", "status": "INTERESTED" }
}`
  },
  {
    id: 'talent-3',
    module: 'Talent/Preselection',
    method: 'PATCH',
    path: '/api/v1/hiring/preselection/:id/:status',
    purpose: 'Avanzar a un candidato en el embudo (ej: CONTACTED, INTERVIEWING).',
    status: 'BRANCH_READY',
    statusLabel: 'Listo en Rama gonza-dev',
    backendState: 'Implementado en la rama gonza-dev (avancePreselection) con firma /preselection/:id/:status.',
    adaptation: 'Fusionar la rama gonza-dev y adaptar la llamada en el frontend para enviar el estado en la URL.',
    focus: 'MERGE'
  },
  // Events
  {
    id: 'event-1',
    module: 'Events',
    method: 'GET',
    path: '/api/v1/events',
    purpose: 'Obtener el calendario de eventos programados (webinars, talleres).',
    status: 'MISSING',
    statusLabel: 'Falta en Backend (Tablas y API)',
    backendState: 'No existen los modelos Event ni EventRegistration en schema.prisma, ni la API.',
    adaptation: 'Declarar los modelos Event y EventRegistration en la DB, correr migraciones, y crear controlador para listar eventos activos/pasados.',
    focus: 'BACKEND',
    resBody: `{
  "success": true,
  "data": [
    { "id": "evt-1", "title": "LinkedIn para Seniors", "type": "Taller", "date": "..." }
  ]
}`
  },
  {
    id: 'event-2',
    module: 'Events',
    method: 'POST',
    path: '/api/v1/events/:id/register',
    purpose: 'Inscribirse a un evento.',
    status: 'MISSING',
    statusLabel: 'Falta en Backend (Tablas y API)',
    backendState: 'Ausente.',
    adaptation: 'Crear endpoint que asocie al profesional con el evento en EventRegistration, verificando capacidad máxima.',
    focus: 'BACKEND'
  },
  // Stats
  {
    id: 'stats-1',
    module: 'Stats',
    method: 'GET',
    path: '/api/v1/stats/professional',
    purpose: 'Estadísticas del panel para Profesionales.',
    status: 'MISSING',
    statusLabel: 'Falta en Backend',
    backendState: 'Ausente.',
    adaptation: 'Crear endpoint unificado que calcule el % de completitud de perfil, cuente skills asociadas y eventos registrados pasados.',
    focus: 'BACKEND',
    resBody: `{
  "success": true,
  "data": { "daysActive": 32, "skillsCount": 8, "eventsAttended": 9, "profilePercent": 75 }
}`
  },
  {
    id: 'stats-2',
    module: 'Stats',
    method: 'GET',
    path: '/api/v1/stats/company',
    purpose: 'Estadísticas del panel para Empresas.',
    status: 'MISSING',
    statusLabel: 'Falta en Backend',
    backendState: 'Ausente.',
    adaptation: 'Crear endpoint que cuente ofertas activas y cantidad de candidatos preseleccionados por la empresa.',
    focus: 'BACKEND',
    resBody: `{
  "success": true,
  "data": { "candidatesViewed": 12, "activeJobs": 2, "suggestedMatches": 5 }
}`
  }
];

export default function About() {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFocus, setSelectedFocus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = useMemo(() => {
    const list = new Set(ENDPOINTS_DATA.map(e => e.module));
    return ['all', ...Array.from(list)];
  }, []);

  const statuses = useMemo(() => {
    return [
      { key: 'all', label: 'Todos los estados' },
      { key: 'CONNECTED', label: 'Conectado' },
      { key: 'BRANCH_READY', label: 'Listo en Rama' },
      { key: 'MISSING', label: 'Falta en Backend' },
      { key: 'MISMATCH', label: 'Discrepancia' },
      { key: 'LOCALSTORAGE', label: 'LocalStorage Temp.' }
    ];
  }, []);

  const focusOptions = useMemo(() => {
    return [
      { key: 'all', label: 'Todos los focos/roles' },
      { key: 'BACKEND', label: 'Foco: Backend' },
      { key: 'FRONTEND', label: 'Foco: Frontend' },
      { key: 'MERGE', label: 'Merge DevOps' },
      { key: 'NONE', label: 'Ya conectado' }
    ];
  }, []);

  const filteredEndpoints = useMemo(() => {
    return ENDPOINTS_DATA.filter(e => {
      const matchModule = selectedModule === 'all' || e.module === selectedModule;
      const matchStatus = selectedStatus === 'all' || e.status === selectedStatus;
      const matchFocus = selectedFocus === 'all' || e.focus === selectedFocus;
      return matchModule && matchStatus && matchFocus;
    });
  }, [selectedModule, selectedStatus, selectedFocus]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (status: Endpoint['status']) => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'BRANCH_READY':
        return <GitBranch className="w-5 h-5 text-sky-500 shrink-0" />;
      case 'MISMATCH':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'LOCALSTORAGE':
        return <Database className="w-5 h-5 text-indigo-500 shrink-0" />;
      case 'MISSING':
      default:
        return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
    }
  };

  const getStatusBadgeClass = (status: Endpoint['status']) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'BRANCH_READY':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'MISMATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOCALSTORAGE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'MISSING':
      default:
        return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  const getMethodBadgeClass = (method: Endpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'POST':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'PATCH':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getFocusBadgeClass = (focus: Endpoint['focus']) => {
    switch (focus) {
      case 'BACKEND':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'FRONTEND':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'MERGE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'NONE':
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getFocusLabel = (focus: Endpoint['focus']) => {
    switch (focus) {
      case 'BACKEND':
        return 'Foco: Backend';
      case 'FRONTEND':
        return 'Foco: Frontend';
      case 'MERGE':
        return 'DevOps (Merge)';
      case 'NONE':
      default:
        return 'Conectado';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-700 text-left">
      <PageMeta
        title="Consola de Integración de Endpoints"
        description="Estado de la API y mapa de endpoints requeridos para conectar las vistas del frontend."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-brand-charcoal flex items-center justify-center border border-white/10">
              <Terminal className="w-5 h-5 text-brand-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
              Consola de Integración
            </h1>
          </div>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest ml-[3.25rem]">
            Estado de conexión entre Frontend y Backend (Ruta: <span className="font-mono text-brand-sage">/about</span>)
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-brand-sage/5 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="space-y-2 z-10">
          <h2 className="text-lg font-black text-brand-heading flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-brand-sage" />
            Información de Desarrollo (Git Branches Incluidas)
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-3xl">
            Este panel mapea todas las interacciones de red requeridas por el frontend. Se han agregado notas e íconos especiales
            para identificar la lógica que ya ha sido desarrollada en la rama secundaria <code className="bg-gray-100 text-brand-sage px-1.5 py-0.5 rounded font-mono text-[11px]">gonza-dev</code> (pendiente de fusionar) y ramas ya integradas en <code className="bg-gray-100 text-brand-sage px-1.5 py-0.5 rounded font-mono text-[11px]">main</code> como <code className="bg-gray-100 text-brand-sage px-1.5 py-0.5 rounded font-mono text-[11px]">feature/company-profile-endpoints</code> y <code className="bg-gray-100 text-brand-sage px-1.5 py-0.5 rounded font-mono text-[11px]">feature/profile-skills-manual</code>.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">

          {/* Module filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:inline">Módulo:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
            >
              {modules.map(mod => (
                <option key={mod} value={mod}>{mod === 'all' ? 'Todos los módulos' : mod}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:inline">Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
            >
              {statuses.map(st => (
                <option key={st.key} value={st.key}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Focus filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:inline">Foco/Rol:</span>
            <select
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
            >
              {focusOptions.map(fo => (
                <option key={fo.key} value={fo.key}>{fo.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider pt-2 border-t border-gray-50">
          <span>Mostrando {filteredEndpoints.length} de {ENDPOINTS_DATA.length} endpoints</span>
          <div className="flex gap-4">
            <span className="text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> {ENDPOINTS_DATA.filter(x => x.status === 'CONNECTED').length} Conectados</span>
            <span className="text-sky-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-500"/> {ENDPOINTS_DATA.filter(x => x.status === 'BRANCH_READY').length} Listos en Rama</span>
            <span className="text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"/> {ENDPOINTS_DATA.filter(x => x.status === 'MISSING').length} Faltantes</span>
            <span className="text-amber-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> {ENDPOINTS_DATA.filter(x => x.status === 'MISMATCH').length} Mismatch</span>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="space-y-4">
        {filteredEndpoints.map((ep) => {
          const isExpanded = expandedId === ep.id;
          return (
            <motion.div
              layout="position"
              key={ep.id}
              className={cn(
                "bg-white rounded-2xl border transition-all duration-300 shadow-sm",
                isExpanded ? "border-brand-sage/40 ring-1 ring-brand-sage/20" : "border-gray-100 hover:border-gray-200 hover:shadow"
              )}
            >
              {/* Header row */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : ep.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn("px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider", getMethodBadgeClass(ep.method))}>
                    {ep.method}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-brand-heading truncate">{ep.path}</span>
                      <span className="bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{ep.module}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{ep.purpose}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", getFocusBadgeClass(ep.focus))}>
                    {getFocusLabel(ep.focus)}
                  </span>
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", getStatusBadgeClass(ep.status))}>
                    {getStatusIcon(ep.status)}
                    {ep.statusLabel}
                  </span>
                </div>
              </div>

              {/* Collapsible Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-gray-50 space-y-4 text-xs">
                      {/* State Description */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado en Backend</span>
                          <p className="text-gray-700 font-semibold">{ep.backendState}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acción / Adaptación necesaria</span>
                          <p className="text-gray-700 font-semibold flex items-start gap-1">
                            <ArrowRight className="w-3.5 h-3.5 text-brand-sage shrink-0 mt-0.5" />
                            {ep.adaptation}
                          </p>
                        </div>
                      </div>

                      {/* Request and Response Code Blocks */}
                      {(ep.reqBody || ep.resBody) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {ep.reqBody && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Request Body (JSON)</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCopy(ep.reqBody!, `${ep.id}-req`); }}
                                  className="p-1.5 text-gray-400 hover:text-brand-sage hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  {copiedId === `${ep.id}-req` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <pre className="p-3 bg-brand-bg rounded-xl font-mono text-[10px] text-brand-heading border border-gray-200/50 overflow-x-auto leading-relaxed max-h-48">
                                {ep.reqBody}
                              </pre>
                            </div>
                          )}
                          {ep.resBody && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Response Body (JSON)</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCopy(ep.resBody!, `${ep.id}-res`); }}
                                  className="p-1.5 text-gray-400 hover:text-brand-sage hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  {copiedId === `${ep.id}-res` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <pre className="p-3 bg-brand-bg rounded-xl font-mono text-[10px] text-brand-heading border border-gray-200/50 overflow-x-auto leading-relaxed max-h-48">
                                {ep.resBody}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredEndpoints.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <Terminal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-black text-brand-heading">Ningún endpoint coincide</h3>
            <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto mt-1">
              Probá restableciendo los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
