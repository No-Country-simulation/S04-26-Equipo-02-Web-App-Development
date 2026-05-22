import { useState } from 'react';
import { Plus, Trash2, Briefcase, Calendar } from 'lucide-react';
import type { WorkExperience } from './types';
import { formatDate } from './types';

type ExperienceFormData = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

interface ExperienceSectionProps {
  experience: WorkExperience[];
  onAdd: (data: ExperienceFormData) => Promise<void>;
  onDelete: (id: string) => void;
  saving: boolean;
}

const initialForm: ExperienceFormData = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

export default function ExperienceSection({
  experience,
  onAdd,
  onDelete,
  saving,
}: ExperienceSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ExperienceFormData>(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(form);
      setShowForm(false);
      setForm(initialForm);
    } catch {
      // Error handled by parent via toast
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
        <div>
          <h3 className="font-black text-gray-900">Historial Laboral</h3>
          <p className="text-xs text-gray-400 mt-1">Registra los cargos más relevantes que has tenido</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-brand-sage text-white font-bold rounded-xl text-xs hover:bg-brand-sage-hover transition-all flex items-center gap-1.5 shadow-md shadow-green-700/10"
        >
          <Plus className="w-4 h-4" /> Agregar Cargo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-brand-sage/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 text-sm">Nuevo Cargo Laboral</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Empresa</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Cargo / Rol</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Inicio</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Fin</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.isCurrent}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800 disabled:opacity-50"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={form.isCurrent}
                onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                className="w-4 h-4 rounded text-brand-sage focus:ring-brand-sage"
              />
              <label htmlFor="isCurrent" className="text-xs font-bold text-gray-500 cursor-pointer">Trabajo actualmente aquí</label>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Descripción / Logros principales</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(initialForm); }}
              className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-brand-sage text-white font-bold rounded-xl text-xs hover:bg-brand-sage-hover shadow-sm"
            >
              {saving ? 'Guardando...' : 'Guardar Cargo'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {experience.length > 0 ? (
          experience.map((exp) => (
            <div key={exp.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-all group">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-card flex items-center justify-center text-brand-sage shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-base leading-snug">{exp.role}</h4>
                  <p className="text-brand-sage font-bold text-sm">{exp.company}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : 'Actualidad'}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-500 font-medium leading-relaxed pt-2 max-w-2xl">{exp.description}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDelete(exp.id)}
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
  );
}
