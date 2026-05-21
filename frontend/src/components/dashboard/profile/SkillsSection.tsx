import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProfileSkill } from './types';

interface SkillsSectionProps {
  skills: ProfileSkill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="bg-white p-6 border border-gray-100 rounded-3xl shadow-sm text-left">
      <h3 className="font-black text-gray-900">Habilidades</h3>
      <p className="text-xs text-gray-400 mt-1">Habilidades certificadas mediante las evaluaciones de autodiagnóstico.</p>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {skills.length > 0 ? (
          skills.map((skill) => (
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
  );
}
