import { useState } from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import type { Education } from './types';

interface EducationSectionProps {
  education: Education[];
  onAdd: (data: { institution: string; degree: string; year: number }) => Promise<void>;
  onDelete: (id: string) => void;
  saving: boolean;
}

const initialForm = {
  institution: '',
  degree: '',
  year: new Date().getFullYear(),
};

export default function EducationSection({
  education,
  onAdd,
  onDelete,
  saving,
}: EducationSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(form);
      setShowForm(false);
      setForm(initialForm);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 border border-gray-100 rounded-3xl shadow-sm">
        <div>
          <h3 className="font-black text-gray-900">Formación</h3>
          <p className="text-xs text-gray-400 mt-1">Títulos y grados académicos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-brand-sage text-white font-bold rounded-xl text-xs hover:bg-brand-sage-hover transition-all flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-brand-sage/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 text-xs">Nueva Formación</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Institución</label>
              <input
                type="text"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Título / Certificación Obtenida</label>
              <input
                type="text"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Año de Egreso</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); }} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-1.5 bg-brand-sage text-white font-bold rounded-xl text-xs">Guardar</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {education.length > 0 ? (
          education.map((edu) => (
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
              <button onClick={() => onDelete(edu.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm border border-gray-100">Sin títulos académicos registrados.</div>
        )}
      </div>
    </div>
  );
}
