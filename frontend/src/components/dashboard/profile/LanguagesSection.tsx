import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Language } from './types';

interface LanguagesSectionProps {
  languages: Language[];
  onAdd: (data: { name: string; level: string }) => Promise<void>;
  onDelete: (id: string) => void;
  saving: boolean;
}

const initialForm = {
  name: '',
  level: 'B2 - Avanzado',
};

export default function LanguagesSection({
  languages,
  onAdd,
  onDelete,
  saving,
}: LanguagesSectionProps) {
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
          <h3 className="font-black text-gray-900">Idiomas</h3>
          <p className="text-xs text-gray-400 mt-1">Idiomas que dominas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-2 bg-brand-sage text-white font-bold rounded-xl text-xs hover:bg-brand-sage-hover transition-all flex items-center gap-1 shadow-md"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-brand-sage/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 text-xs">Nuevo Idioma</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Idioma (Ej: Inglés)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Nivel</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-brand-sage outline-none text-xs font-semibold text-brand-heading h-10"
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
            <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); }} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-1.5 bg-brand-sage text-white font-bold rounded-xl text-xs">Guardar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {languages.length > 0 ? (
          languages.map((lang) => (
            <div key={lang.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center group">
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">{lang.name}</p>
                <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider">{lang.level}</span>
              </div>
              <button onClick={() => onDelete(lang.id)} className="text-gray-300 hover:text-red-500 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-6 text-center text-gray-400 text-xs border border-gray-100">Sin idiomas registrados.</div>
        )}
      </div>
    </div>
  );
}
