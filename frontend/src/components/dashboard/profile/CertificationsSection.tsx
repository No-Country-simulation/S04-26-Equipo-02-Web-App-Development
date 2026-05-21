import { useState } from 'react';
import { Plus, Trash2, Award, Link2 } from 'lucide-react';
import type { Certification } from './types';
import { formatDate } from './types';

interface CertificationsSectionProps {
  certifications: Certification[];
  onAdd: (data: { name: string; issuer: string; issueDate: string; url: string }) => Promise<void>;
  onDelete: (id: string) => void;
  saving: boolean;
}

const initialForm = {
  name: '',
  issuer: '',
  issueDate: '',
  url: '',
};

export default function CertificationsSection({
  certifications,
  onAdd,
  onDelete,
  saving,
}: CertificationsSectionProps) {
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
          <h3 className="font-black text-gray-900">Certificaciones</h3>
          <p className="text-xs text-gray-400 mt-1">Cursos, licencias y diplomas certificados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs hover:bg-[#6b8c5c] transition-all flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-[#7B9E6B]/30 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 text-xs">Nueva Certificación</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre de la Certificación</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Emisor / Certificador</label>
              <input
                type="text"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Expedición</label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">URL de Verificación (Opcional)</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-55 border border-gray-200 rounded-xl focus:border-[#7B9E6B] outline-none text-xs font-semibold text-gray-800"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); }} className="px-3 py-1.5 text-xs text-gray-400">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-1.5 bg-[#7B9E6B] text-white font-bold rounded-xl text-xs">Guardar</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {certifications.length > 0 ? (
          certifications.map((cert) => (
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
              <button onClick={() => onDelete(cert.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm border border-gray-100">Sin certificaciones registradas.</div>
        )}
      </div>
    </div>
  );
}
