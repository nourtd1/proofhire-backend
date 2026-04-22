export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
}

export interface Language {
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  isCurrent: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  link?: string;
  startDate: string;
  endDate: string;
}

export interface Availability {
  status: 'Available' | 'Open to Opportunities' | 'Not Available';
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  startDate?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface TalentProfile {
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  bio: string;
  location: string;
  skills: Skill[];
  languages: Language[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
  projects?: Project[];
  availability: Availability;
  socialLinks?: SocialLinks;
}

// Additional exports for Gemini screening service

export type SkillType = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
};

export type ExperienceType = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  isCurrent: boolean;
};

export type ProjectType = {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  link?: string;
  startDate: string;
  endDate: string;
};

export type EducationType = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
};

export type CertificationType = {
  name: string;
  issuer: string;
  issueDate: string;
};

export type JobType = {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: string;
  createdAt: Date;
};

export type ApplicantType = {
  _id: { toString(): string };
  jobId: string;
  profile: TalentProfile;
  resumeText?: string;
  source: 'platform' | 'upload';
  createdAt: Date;
};

export interface SingleScreeningResult {
  applicantId: string;
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendation: 'Hire' | 'Maybe' | 'Pass';
  reasoning: string;
  rank: number;
}
