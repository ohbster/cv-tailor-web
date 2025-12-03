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
  skill_id: number;
  name: string;
  tag_id?: number;
}

export interface Certification {
  cert_id: number;
  name: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface WorkExperience {
  work_exp_id: number;
  company: string;
  role: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface Project {
  project_id: number;
  name: string;
  description?: string;
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

  getById: async (id: number): Promise<Skill> => {
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

  getById: async (id: number): Promise<Certification> => {
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
  getAll: async (skip = 0, limit = 100): Promise<WorkExperience[]> => {
    return fetchAPI<WorkExperience[]>(`/work-experience/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: number): Promise<WorkExperience> => {
    return fetchAPI<WorkExperience>(`/work-experience/${id}`);
  },

  create: async (exp: Omit<WorkExperience, 'work_exp_id'>): Promise<WorkExperience> => {
    return fetchAPI<WorkExperience>('/work-experience/', {
      method: 'POST',
      body: JSON.stringify(exp),
    });
  },
};

// ==================== PROJECTS API ====================

export const projectsAPI = {
  getAll: async (skip = 0, limit = 100): Promise<Project[]> => {
    return fetchAPI<Project[]>(`/projects/?skip=${skip}&limit=${limit}`);
  },

  getById: async (id: number): Promise<Project> => {
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
