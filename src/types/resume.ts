export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  year: string;
  grade?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  summary: string;
  nyscStatus?: string;
}
