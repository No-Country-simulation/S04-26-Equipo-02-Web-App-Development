import { Phone, MapPin, Link2, Save, Loader2 } from 'lucide-react';
import type { BasicFormState } from './types';

interface BasicInfoFormProps {
  basicForm: BasicFormState;
  onChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export default function BasicInfoForm({
  basicForm,
  onChange,
  onSubmit,
  saving,
}: BasicInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
      <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">Información General</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</label>
          <input
            type="text"
            value={basicForm.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Apellido</label>
          <input
            type="text"
            value={basicForm.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título Profesional (Ej: Consultor Sr en Operaciones)</label>
          <input
            type="text"
            value={basicForm.professionalTitle}
            onChange={(e) => onChange('professionalTitle', e.target.value)}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Años de Experiencia</label>
          <input
            type="number"
            value={basicForm.yearsOfExperience}
            onChange={(e) => onChange('yearsOfExperience', Number(e.target.value))}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={basicForm.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
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
              onChange={(e) => onChange('location', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
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
              onChange={(e) => onChange('linkedinUrl', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
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
              onChange={(e) => onChange('portfolioUrl', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Disponibilidad Laboral</label>
          <select
            value={basicForm.availability}
            onChange={(e) => onChange('availability', e.target.value)}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-brand-heading h-12"
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
            onChange={(e) => onChange('preferredModality', e.target.value as 'REMOTE' | 'HYBRID' | 'ON_SITE')}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-brand-heading h-12"
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
            onChange={(e) => onChange('valueProposition', e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biografía Completa</label>
          <textarea
            value={basicForm.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 bg-brand-bg/50 border border-gray-100 rounded-xl focus:border-brand-sage focus:bg-white outline-none transition-all text-sm font-semibold text-gray-800"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-brand-sage hover:bg-brand-sage-hover text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
        </button>
      </div>
    </form>
  );
}
