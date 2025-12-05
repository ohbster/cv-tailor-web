/**
 * API Client for Resume Adjuster Backend
 * 
 * This module provides typed functions to interact with the FastAPI backend.
 * Base URL is configured via NEXT_PUBLIC_API_URL environment variable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling and auth token support
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add authorization header if token is provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ==================== TYPES ====================

export interface Candidate {
  id: string;  // UUID
  full_name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

export interface CandidateCreate {
  full_name: string;
  email: string;
  password: string;  // Required for registration
  phone?: string;
  linkedin?: string;
  github?: string;
}

export interface Skill {
  skill_id: string;  // UUID
  name: string;
  tag_id?: string;
}

export interface Certification {
  cert_id: string;  // UUID
  name: string;
}

export interface WorkExperience {
  work_exp_id: string;  // UUID
  candidate_id?: string;
  company: string;
  role: string;
  location?: string;
  details?: string;
  start_date?: string;
  end_date?: string;
}

export interface WorkExperienceCreate {
  company: string;
  role: string;
  location?: string;
  details?: string;
  start_date?: string;
  end_date?: string;
}

export interface CandidateSkill {
  candidate_id: string;
  skill_id: string;
  skill_name?: string;
  level?: number;  // 1-5
  years_experience?: number;
}

export interface CandidateSkillCreate {
  skill_id: string;
  level?: number;
  years_experience?: number;
}

export interface CandidateCertification {
  candidate_id: string;
  cert_id: string;
  cert_name?: string;
  credential_id?: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface CandidateCertificationCreate {
  cert_id: string;
  credential_id?: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface CandidateProject {
  candidate_id: string;
  project_id: string;
  project_name?: string;
  project_description?: string;
  project_url?: string;
  start_date?: string;
  end_date?: string;
}

export interface Project {
  project_id: string;  // UUID
  name: string;
  description?: string;
  details?: string;
  url?: string;
}

export interface CandidateProjectCreate {
  project_id: string;
  start_date?: string;
  end_date?: string;
}

export interface JobDescription {
  jd_id: number;
  title: string;
  description?: string;
}

export interface Resume {
  resume_id: number;
  candidate_id: number;
  jd_id: number;
  resume_score?: number;
  created_at?: string;
}

// ==================== CANDIDATE API ====================

export const candidateAPI = {
  /**
   * Get current user's profile (requires authentication)
   */
  getMe: async (token: string): Promise<Candidate> => {
    return fetchAPI<Candidate>('/candidates/me', {}, token);
  },

  /**
   * Get a single candidate by ID (requires authentication and ownership)
   */
  getById: async (id: string, token: string): Promise<Candidate> => {
    return fetchAPI<Candidate>(`/candidates/${id}`, {}, token);
  },

  /**
   * Update current user's profile (requires authentication)
   */
  updateMe: async (candidate: Partial<CandidateCreate>, token: string): Promise<Candidate> => {
    return fetchAPI<Candidate>('/candidates/me', {
      method: 'PUT',
      body: JSON.stringify(candidate),
    }, token);
  },

  /**
   * Delete current user's account (requires authentication)
   */
  deleteMe: async (token: string): Promise<void> => {
    return fetchAPI<void>('/candidates/me', {
      method: 'DELETE',
    }, token);
  },
};

// ==================== SKILLS API ====================

export const skillsAPI = {
  getAll: async (skip = 0, limit = 100): Promise<Skill[]> => {
    return fetchAPI<Skill[]>(`/skills/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: string): Promise<Skill> => {
    return fetchAPI<Skill>(`/skills/${id}`);
  },

  create: async (skill: Omit<Skill, 'skill_id'>): Promise<Skill> => {
    return fetchAPI<Skill>('/skills/', {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  },
};

// ==================== CERTIFICATIONS API ====================

export const certificationsAPI = {
  getAll: async (skip = 0, limit = 100): Promise<Certification[]> => {
    return fetchAPI<Certification[]>(`/certifications/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: string): Promise<Certification> => {
    return fetchAPI<Certification>(`/certifications/${id}`);
  },

  create: async (cert: Omit<Certification, 'cert_id'>): Promise<Certification> => {
    return fetchAPI<Certification>('/certifications/', {
      method: 'POST',
      body: JSON.stringify(cert),
    });
  },
};

// ==================== WORK EXPERIENCE API ====================

export const workExperienceAPI = {
  /**
   * Get current candidate's work experiences
   */
  getMy: async (token: string): Promise<WorkExperience[]> => {
    return fetchAPI<WorkExperience[]>('/candidates/me/work-experience/', {}, token);
  },

  /**
   * Add work experience to current candidate's profile
   */
  create: async (exp: WorkExperienceCreate, token: string): Promise<WorkExperience> => {
    return fetchAPI<WorkExperience>('/candidates/me/work-experience/', {
      method: 'POST',
      body: JSON.stringify(exp),
    }, token);
  },

  /**
   * Update work experience
   */
  update: async (id: string, exp: Partial<WorkExperienceCreate>, token: string): Promise<WorkExperience> => {
    return fetchAPI<WorkExperience>(`/candidates/me/work-experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exp),
    }, token);
  },

  /**
   * Delete work experience
   */
  delete: async (id: string, token: string): Promise<void> => {
    await fetchAPI<void>(`/candidates/me/work-experience/${id}`, {
      method: 'DELETE',
    }, token);
  },
};

// ==================== CANDIDATE SKILLS API ====================

export const candidateSkillsAPI = {
  /**
   * Get current candidate's skills with proficiency
   */
  getMy: async (token: string): Promise<CandidateSkill[]> => {
    return fetchAPI<CandidateSkill[]>('/candidates/me/skills/', {}, token);
  },

  /**
   * Add skill to current candidate's profile
   */
  create: async (skill: CandidateSkillCreate, token: string): Promise<CandidateSkill> => {
    return fetchAPI<CandidateSkill>('/candidates/me/skills/', {
      method: 'POST',
      body: JSON.stringify(skill),
    }, token);
  },

  /**
   * Update skill proficiency
   */
  update: async (skillId: string, skill: Partial<CandidateSkillCreate>, token: string): Promise<CandidateSkill> => {
    return fetchAPI<CandidateSkill>(`/candidates/me/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(skill),
    }, token);
  },

  /**
   * Remove skill from profile
   */
  delete: async (skillId: string, token: string): Promise<void> => {
    await fetchAPI<void>(`/candidates/me/skills/${skillId}`, {
      method: 'DELETE',
    }, token);
  },
};

// ==================== CANDIDATE CERTIFICATIONS API ====================

export const candidateCertificationsAPI = {
  /**
   * Get current candidate's certifications
   */
  getMy: async (token: string): Promise<CandidateCertification[]> => {
    return fetchAPI<CandidateCertification[]>('/candidates/me/certifications/', {}, token);
  },

  /**
   * Add certification to current candidate's profile
   */
  create: async (cert: CandidateCertificationCreate, token: string): Promise<CandidateCertification> => {
    return fetchAPI<CandidateCertification>('/candidates/me/certifications/', {
      method: 'POST',
      body: JSON.stringify(cert),
    }, token);
  },

  /**
   * Update certification details
   */
  update: async (certId: string, cert: Partial<CandidateCertificationCreate>, token: string): Promise<CandidateCertification> => {
    return fetchAPI<CandidateCertification>(`/candidates/me/certifications/${certId}`, {
      method: 'PUT',
      body: JSON.stringify(cert),
    }, token);
  },

  /**
   * Remove certification from profile
   */
  delete: async (certId: string, token: string): Promise<void> => {
    await fetchAPI<void>(`/candidates/me/certifications/${certId}`, {
      method: 'DELETE',
    }, token);
  },
};

// ==================== CANDIDATE PROJECTS API ====================

export const candidateProjectsAPI = {
  /**
   * Get current candidate's projects
   */
  getMy: async (token: string): Promise<CandidateProject[]> => {
    return fetchAPI<CandidateProject[]>('/candidates/me/projects/', {}, token);
  },

  /**
   * Link project to current candidate's profile
   */
  create: async (project: CandidateProjectCreate, token: string): Promise<CandidateProject> => {
    return fetchAPI<CandidateProject>('/candidates/me/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
    }, token);
  },

  /**
   * Update project participation details
   */
  update: async (projectId: string, project: Partial<CandidateProjectCreate>, token: string): Promise<CandidateProject> => {
    return fetchAPI<CandidateProject>(`/candidates/me/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }, token);
  },

  /**
   * Remove project from profile
   */
  delete: async (projectId: string, token: string): Promise<void> => {
    await fetchAPI<void>(`/candidates/me/projects/${projectId}`, {
      method: 'DELETE',
    }, token);
  },
};

// ==================== PROJECTS API ====================

export const projectsAPI = {
  getAll: async (skip = 0, limit = 100): Promise<Project[]> => {
    return fetchAPI<Project[]>(`/projects/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: string): Promise<Project> => {
    return fetchAPI<Project>(`/projects/${id}`);
  },

  create: async (project: Omit<Project, 'project_id'>): Promise<Project> => {
    return fetchAPI<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },
};

// ==================== JOB DESCRIPTIONS API ====================

export const jobDescriptionsAPI = {
  getAll: async (skip = 0, limit = 100): Promise<JobDescription[]> => {
    return fetchAPI<JobDescription[]>(`/job-descriptions/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: number): Promise<JobDescription> => {
    return fetchAPI<JobDescription>(`/job-descriptions/${id}`);
  },

  create: async (jd: Omit<JobDescription, 'jd_id'>): Promise<JobDescription> => {
    return fetchAPI<JobDescription>('/job-descriptions/', {
      method: 'POST',
      body: JSON.stringify(jd),
    });
  },
};

// ==================== RESUMES API ====================

export const resumesAPI = {
  getAll: async (skip = 0, limit = 100): Promise<Resume[]> => {
    return fetchAPI<Resume[]>(`/resumes/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: number): Promise<Resume> => {
    return fetchAPI<Resume>(`/resumes/${id}`);
  },

  create: async (resume: Omit<Resume, 'resume_id' | 'created_at' | 'resume_score'>): Promise<Resume> => {
    return fetchAPI<Resume>('/resumes/', {
      method: 'POST',
      body: JSON.stringify(resume),
    });
  },
};
