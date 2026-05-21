import { Building2, Globe, MapPin, FileText, Save, Loader2 } from 'lucide-react';
import type { CompanyFormState } from './types';

interface CompanyProfileFormProps {
  companyForm: CompanyFormState;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export default function CompanyProfileForm({
  companyForm,
  onChange,
  onSubmit,
  saving,
}: CompanyProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre de la Empresa</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={companyForm.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
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
            onChange={(e) => onChange('industry', e.target.value)}
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
              onChange={(e) => onChange('website', e.target.value)}
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
              onChange={(e) => onChange('location', e.target.value)}
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
              onChange={(e) => onChange('description', e.target.value)}
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
  );
}
