export interface Project {
  title: string;
  description: string[];
}

export interface Job {
  title: string;
  company: string;
  period: string;
  description?: string[];
  projects?: Project[];
  highlight?: string; // New field for special emphasis notes
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  honors?: string[];
  details?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}