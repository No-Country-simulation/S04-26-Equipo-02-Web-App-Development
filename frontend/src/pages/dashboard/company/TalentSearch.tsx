import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { PageMeta } from '../../../hooks/useMeta';
import {
  Search,
  MapPin,
  X,
  Filter,
  Briefcase,
  Star,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Mock Data ───────────────────────────────────────────────────────────────

type Availability = 'Disponible' | 'En proceso' | 'Abierto a propuestas';
type Area = 'Tecnología' | 'Salud' | 'Educación' | 'Administración';

interface Professional {
  id: number;
  name: string;
  title: string;
  location: string;
  skills: string[];
  experience: number;
  matchScore: number;
  availability: Availability;
  area: Area;
  valueProp: string;
}

const professionals: Professional[] = [
  {
    id: 1,
    name: 'Ricardo Méndez',
    title: 'Arquitecto de Software Senior',
    location: 'Buenos Aires, CABA',
    skills: ['Java', 'Spring Boot', 'Microservicios', 'AWS', 'Kubernetes'],
    experience: 28,
    matchScore: 94,
    availability: 'Disponible',
    area: 'Tecnología',
    valueProp: '30+ años liderando equipos de ingeniería en banca y fintech.',
  },
  {
    id: 2,
    name: 'Silvia Gallardo',
    title: 'Directora de Proyectos TI',
    location: 'Córdoba, Argentina',
    skills: ['PMP', 'Scrum', 'Jira', 'Gestión de Riesgos', 'Presupuestos'],
    experience: 22,
    matchScore: 89,
    availability: 'Abierto a propuestas',
    area: 'Administración',
    valueProp: 'Expertise en transformación digital para organizaciones del sector público y privado.',
  },
  {
    id: 3,
    name: 'Horacio Páez',
    title: 'Médico Cardiólogo',
    location: 'Rosario, Santa Fe',
    skills: ['Cardiología Clínica', 'Ecocardiografía', 'Gestión Sanitaria', 'Telemedicina'],
    experience: 32,
    matchScore: 87,
    availability: 'En proceso',
    area: 'Salud',
    valueProp: 'Referente en cardiología preventiva con más de 30 años de práctica hospitalaria.',
  },
  {
    id: 4,
    name: 'Marcela Insúa',
    title: 'CTO & Tech Lead',
    location: 'Mendoza, Argentina',
    skills: ['React', 'Node.js', 'TypeScript', 'DevOps', 'Arquitectura Cloud'],
    experience: 20,
    matchScore: 96,
    availability: 'Disponible',
    area: 'Tecnología',
    valueProp: 'Scaló equipos de 0 a 50 ingenieros en startups de Latinoamérica.',
  },
  {
    id: 5,
    name: 'Carlos Ferreyra',
    title: 'Director de Operaciones',
    location: 'La Plata, Buenos Aires',
    skills: ['Lean Six Sigma', 'Supply Chain', 'ERP', 'Gestión de Equipos', 'KPI'],
    experience: 25,
    matchScore: 82,
    availability: 'Abierto a propuestas',
    area: 'Administración',
    valueProp: 'Optimización de procesos operativos en empresas industriales multilatinas.',
  },
  {
    id: 6,
    name: 'Adriana Benítez',
    title: 'Docente Universitaria Senior',
    location: 'Tucumán, Argentina',
    skills: ['Pedagogía', 'Investigación', 'Currícula', 'Evaluación', 'Mentoría'],
    experience: 30,
    matchScore: 78,
    availability: 'Disponible',
    area: 'Educación',
    valueProp: 'Exdecana de la Facultad de Ciencias Exactas con publicaciones internacionales.',
  },
  {
    id: 7,
    name: 'Gabriel Montenegro',
    title: 'Ingeniero de Datos Senior',
    location: 'Buenos Aires, CABA',
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake', 'Tableau'],
    experience: 18,
    matchScore: 91,
    availability: 'En proceso',
    area: 'Tecnología',
    valueProp: 'Construyó data pipelines que procesan 10TB/día para e-commerce líder.',
  },
  {
    id: 8,
    name: 'Liliana Roldán',
    title: 'Directora Médica',
    location: 'Mar del Plata, Buenos Aires',
    skills: ['Gestión Hospitalaria', 'Auditoría Médica', 'Calidad', 'Acreditaciones'],
    experience: 35,
    matchScore: 85,
    availability: 'Abierto a propuestas',
    area: 'Salud',
    valueProp: 'Lideró la acreditación Joint Commission de 3 hospitales privados.',
  },
  {
    id: 9,
    name: 'Patricio Lagos',
    title: 'Especialista en Educación Técnica',
    location: 'Salta, Argentina',
    skills: ['Diseño Curricular', 'Formación Docente', 'TIC', 'Educación Dual', 'Evaluación'],
    experience: 24,
    matchScore: 80,
    availability: 'Disponible',
    area: 'Educación',
    valueProp: 'Diseñó programas de formación técnica para 5000+ estudiantes en todo el país.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const areaOptions = [
  { value: '', label: 'Todas las áreas' },
  { value: 'Tecnología', label: 'Tecnología' },
  { value: 'Salud', label: 'Salud' },
  { value: 'Educación', label: 'Educación' },
  { value: 'Administración', label: 'Administración' },
] as const;

const availabilityOptions = [
  { value: '', label: 'Cualquier disponibilidad' },
  { value: 'Disponible', label: 'Disponible' },
  { value: 'En proceso', label: 'En proceso' },
  { value: 'Abierto a propuestas', label: 'Abierto a propuestas' },
] as const;

const locationOptions = [
  { value: '', label: 'Todas las ubicaciones' },
  { value: 'Buenos Aires, CABA', label: 'Buenos Aires, CABA' },
  { value: 'Córdoba, Argentina', label: 'Córdoba' },
  { value: 'Rosario, Santa Fe', label: 'Rosario' },
  { value: 'Mendoza, Argentina', label: 'Mendoza' },
  { value: 'La Plata, Buenos Aires', label: 'La Plata' },
  { value: 'Tucumán, Argentina', label: 'Tucumán' },
  { value: 'Mar del Plata, Buenos Aires', label: 'Mar del Plata' },
  { value: 'Salta, Argentina', label: 'Salta' },
] as const;

const areaColors: Record<Area, { bg: string; text: string }> = {
  Tecnología: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Salud: { bg: 'bg-sky-100', text: 'text-sky-700' },
  Educación: { bg: 'bg-violet-100', text: 'text-violet-700' },
  Administración: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
}

function getAvailabilityDotColor(availability: Availability): string {
  switch (availability) {
    case 'Disponible':
      return 'bg-emerald-400';
    case 'En proceso':
      return 'bg-amber-400';
    case 'Abierto a propuestas':
      return 'bg-gray-300';
  }
}

function getAvailabilityBg(availability: Availability): string {
  switch (availability) {
    case 'Disponible':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'En proceso':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Abierto a propuestas':
      return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TalentSearch() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // --- Derived active filters ---
  const activeFilters: { label: string; onRemove: () => void }[] = [];

  if (selectedArea) {
    activeFilters.push({
      label: `Área: ${selectedArea}`,
      onRemove: () => setSelectedArea(''),
    });
  }
  if (selectedLocation) {
    const loc = locationOptions.find((o) => o.value === selectedLocation);
    activeFilters.push({
      label: `Ubicación: ${loc?.label ?? selectedLocation}`,
      onRemove: () => setSelectedLocation(''),
    });
  }
  if (selectedAvailability) {
    activeFilters.push({
      label: `Disponibilidad: ${selectedAvailability}`,
      onRemove: () => setSelectedAvailability(''),
    });
  }

  // --- Filtering ---
  const filtered = professionals.filter((p) => {
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    if (selectedArea && p.area !== selectedArea) return false;
    if (selectedLocation && p.location !== selectedLocation) return false;
    if (selectedAvailability && p.availability !== selectedAvailability) return false;
    return true;
  });

  // --- Filter dropdown toggle ---
  const filtersOpen = showFilters;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageMeta
        title={user?.name ? `Buscar Talento — ${user.name}` : 'Buscar Talento Senior'}
        description="Encontrá profesionales senior con experiencia y trayectoria validada en Red de Bienestar Laboral."
      />
      {/* ──────── HEADER ──────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-brand-heading tracking-tight">
          Buscar Talento Senior
        </h1>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">
          Encontrá profesionales con experiencia y trayectoria
        </p>
      </motion.div>

      {/* ──────── SEARCH + FILTER BAR ──────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        {/* Search row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscá por nombre, cargo o skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-brand-heading font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all"
            />
          </div>
          <button className="btn-primary md:w-auto whitespace-nowrap">
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn-secondary md:w-auto whitespace-nowrap',
              filtersOpen && 'border-brand-sage text-brand-sage bg-brand-bg/50'
            )}
          >
            <Filter className="w-4 h-4" />
            Filtros
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-300',
                filtersOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Collapsible filter chips */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Área */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Área
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {areaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ubicación */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Ubicación
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {locationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Disponibilidad */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Disponibilidad
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all appearance-none"
                  >
                    {availabilityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters row */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeFilters.map((f) => (
              <button
                key={f.label}
                onClick={f.onRemove}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-bg text-brand-heading text-xs font-bold rounded-full border border-brand-sage/20 hover:bg-brand-sage/10 transition-colors"
              >
                {f.label}
                <X className="w-3 h-3 text-gray-400 hover:text-brand-heading" />
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedArea('');
                setSelectedLocation('');
                setSelectedAvailability('');
              }}
              className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-brand-sage transition-colors ml-1"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </motion.div>

      {/* ──────── RESULTS COUNT ──────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-bold text-gray-400 uppercase tracking-wider"
      >
        Mostrando {filtered.length} profesional{filtered.length !== 1 ? 'es' : ''}
      </motion.p>

      {/* ──────── PROFESSIONAL CARDS GRID ──────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filtered.map((p) => {
          const initials = getInitials(p.name);
          const areaStyle = areaColors[p.area];

          return (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              {/* Card content */}
              <div className="p-6 flex flex-col gap-4">
                {/* Avatar + Name row */}
                <div className="flex items-start gap-4">
                  {/* Photo placeholder */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-sm font-black tracking-wide',
                      areaStyle.bg,
                      areaStyle.text
                    )}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-brand-heading truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 truncate">
                      {p.title}
                    </p>
                  </div>

                  {/* Match badge */}
                  <div
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0',
                      p.matchScore >= 90
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : p.matchScore >= 80
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                    )}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {p.matchScore}%
                  </div>
                </div>

                {/* Value proposition */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {p.valueProp}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {p.location}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {p.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-brand-bg text-brand-heading text-[11px] font-bold rounded-lg border border-brand-sage/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Experience + Availability */}
                <div className="flex items-center justify-between pt-1">
                  {/* Experience */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Briefcase className="w-3.5 h-3.5" />
                    {p.experience} años de experiencia
                  </div>

                  {/* Availability badge */}
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                      getAvailabilityBg(p.availability)
                    )}
                  >
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        getAvailabilityDotColor(p.availability)
                      )}
                    />
                    {p.availability}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Action */}
                <div className="flex justify-end">
                  <button className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sage hover:text-brand-sage-hover transition-colors group/btn">
                    Ver Perfil
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-brand-heading mb-1">
              Sin resultados
            </h3>
            <p className="text-sm text-gray-400 font-semibold max-w-xs">
              No encontramos profesionales con esos filtros. Probá cambiando los
              criterios de búsqueda.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
