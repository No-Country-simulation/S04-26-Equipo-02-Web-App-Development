import { User, Briefcase, GraduationCap, Languages } from 'lucide-react';
import type { TabId } from './types';

interface ProfileTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: 'basic', label: 'Info Básica', icon: User },
  { id: 'experience', label: 'Experiencia', icon: Briefcase },
  { id: 'education', label: 'Educación y Certificaciones', icon: GraduationCap },
  { id: 'languages', label: 'Idiomas y Habilidades', icon: Languages },
];

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto gap-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 pb-4 px-1 font-bold text-sm border-b-2 transition-all whitespace-nowrap outline-none ${
            activeTab === tab.id
              ? 'border-brand-sage text-brand-sage'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
