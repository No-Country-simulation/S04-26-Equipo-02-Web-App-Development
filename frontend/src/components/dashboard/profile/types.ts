export interface ProfileSkill {
  id: string;
  isVerified: boolean;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  url: string | null;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ProfessionalProfile {
  id: string;
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  valueProposition: string | null;
  yearsOfExperience: number | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  availability: 'AVAILABLE' | 'IN_PROCESS' | 'NOT_AVAILABLE';
  preferredModality: 'REMOTE' | 'ON_SITE' | 'HYBRID';
  salaryExpectation: string | null;
  completionScore: number;
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  skills: ProfileSkill[];
}

export type TabId = 'basic' | 'experience' | 'education' | 'languages';

export type BasicFormState = {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  valueProposition: string;
  yearsOfExperience: number;
  phone: string;
  location: string;
  bio: string;
  linkedinUrl: string;
  portfolioUrl: string;
  availability: string;
  preferredModality: string;
  salaryExpectation: string;
};

export type CompanyFormState = {
  companyName: string;
  industry: string;
  website: string;
  description: string;
  location: string;
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}
