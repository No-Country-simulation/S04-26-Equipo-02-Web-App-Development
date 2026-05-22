import { motion } from 'framer-motion';
import { Camera, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@/types';

import type { ProfessionalProfile } from './profile/types';
export type { ProfessionalProfile };

interface ProfileSummaryCardProps {
  profile: ProfessionalProfile | null;
  user: User | null;
}

export default function ProfileSummaryCard({ profile, user }: ProfileSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-28 h-28 rounded-full border-4 border-brand-sage/30 overflow-hidden shadow-inner group">
          <img
            src="/default-professional.png"
            alt="Profesional"
            className="w-full h-full object-cover"
          />
          <Link to="/dashboard/profile" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </Link>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900">
            {profile ? `${profile.firstName} ${profile.lastName}` : user?.name || 'Mi Perfil'}
          </h2>
          <p className="text-brand-sage font-bold text-xs uppercase tracking-wider">
            {profile?.professionalTitle || 'Profesional Senior'}
          </p>
          {profile?.location && (
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-semibold uppercase">Propuesta de Valor</span>
        </div>
        <p className="text-xs text-gray-600 italic font-medium leading-relaxed">
          &quot;{profile?.valueProposition || 'Aporto valor a través de mi experiencia, liderazgo y resiliencia en equipos dinámicos.'}&quot;
        </p>
      </div>
    </motion.div>
  );
}
