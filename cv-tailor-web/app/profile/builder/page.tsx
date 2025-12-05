"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  workExperienceAPI,
  candidateSkillsAPI,
  candidateCertificationsAPI,
  candidateProjectsAPI,
  WorkExperience,
  CandidateSkill,
  CandidateCertification,
  CandidateProject,
  WorkExperienceCreate,
  CandidateSkillCreate,
  CandidateCertificationCreate,
  CandidateProjectCreate,
} from "@/lib/api";
import WorkExperienceForm from "@/components/profile/WorkExperienceForm";
import SkillSelector from "@/components/profile/SkillSelector";
import CertificationForm from "@/components/profile/CertificationForm";
import ProjectForm from "@/components/profile/ProjectForm";

type TabType = "experience" | "skills" | "certifications" | "projects";

export default function ProfileBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("experience");
  const [loading, setLoading] = useState(true);

  // Data states
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [certifications, setCertifications] = useState<CandidateCertification[]>([]);
  const [projects, setProjects] = useState<CandidateProject[]>([]);

  // Form states
  const [showWorkExpForm, setShowWorkExpForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingWorkExp, setEditingWorkExp] = useState<WorkExperience | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session) {
      loadAllData();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, session, router]);

  const getToken = () => (session as any)?.accessToken || "";

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const [expData, skillData, certData, projData] = await Promise.all([
        workExperienceAPI.getMy(token),
        candidateSkillsAPI.getMy(token),
        candidateCertificationsAPI.getMy(token),
        candidateProjectsAPI.getMy(token),
      ]);
      setWorkExperiences(expData);
      setSkills(skillData);
      setCertifications(certData);
      setProjects(projData);
    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Work Experience handlers
  const handleAddWorkExp = async (data: WorkExperienceCreate) => {
    const exp = await workExperienceAPI.create(data, getToken());
    setWorkExperiences([...workExperiences, exp]);
    setShowWorkExpForm(false);
  };

  const handleUpdateWorkExp = async (data: WorkExperienceCreate) => {
    if (!editingWorkExp) return;
    const updated = await workExperienceAPI.update(editingWorkExp.work_exp_id, data, getToken());
    setWorkExperiences(workExperiences.map(e => e.work_exp_id === updated.work_exp_id ? updated : e));
    setEditingWorkExp(null);
    setShowWorkExpForm(false);
  };

  const handleDeleteWorkExp = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work experience?")) return;
    await workExperienceAPI.delete(id, getToken());
    setWorkExperiences(workExperiences.filter(e => e.work_exp_id !== id));
  };

  // Skill handlers
  const handleAddSkill = async (data: CandidateSkillCreate) => {
    const skill = await candidateSkillsAPI.create(data, getToken());
    setSkills([...skills, skill]);
    setShowSkillForm(false);
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm("Are you sure you want to remove this skill?")) return;
    await candidateSkillsAPI.delete(skillId, getToken());
    setSkills(skills.filter(s => s.skill_id !== skillId));
  };

  // Certification handlers
  const handleAddCert = async (data: CandidateCertificationCreate) => {
    const cert = await candidateCertificationsAPI.create(data, getToken());
    setCertifications([...certifications, cert]);
    setShowCertForm(false);
  };

  const handleDeleteCert = async (certId: string) => {
    if (!confirm("Are you sure you want to remove this certification?")) return;
    await candidateCertificationsAPI.delete(certId, getToken());
    setCertifications(certifications.filter(c => c.cert_id !== certId));
  };

  // Project handlers
  const handleAddProject = async (data: CandidateProjectCreate) => {
    const project = await candidateProjectsAPI.create(data, getToken());
    setProjects([...projects, project]);
    setShowProjectForm(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to remove this project?")) return;
    await candidateProjectsAPI.delete(projectId, getToken());
    setProjects(projects.filter(p => p.project_id !== projectId));
  };

  const formatDate = (date?: string) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl text-gray-700 dark:text-gray-300">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Builder</h1>
          <p className="text-gray-600 dark:text-gray-400">Build your professional profile to generate tailored resumes</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {[
                { id: "experience" as TabType, label: "Work Experience", count: workExperiences.length },
                { id: "skills" as TabType, label: "Skills", count: skills.length },
                { id: "certifications" as TabType, label: "Certifications", count: certifications.length },
                { id: "projects" as TabType, label: "Projects", count: projects.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Work Experience Tab */}
            {activeTab === "experience" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                  <button
                    onClick={() => setShowWorkExpForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Add Experience
                  </button>
                </div>

                {showWorkExpForm && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {editingWorkExp ? "Edit" : "Add"} Work Experience
                    </h3>
                    <WorkExperienceForm
                      experience={editingWorkExp || undefined}
                      onSubmit={editingWorkExp ? handleUpdateWorkExp : handleAddWorkExp}
                      onCancel={() => {
                        setShowWorkExpForm(false);
                        setEditingWorkExp(null);
                      }}
                    />
                  </div>
                )}

                {workExperiences.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No work experience added yet. Click "Add Experience" to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workExperiences.map((exp) => (
                      <div
                        key={exp.work_exp_id}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                            {exp.location && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{exp.location}</p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                            </p>
                            {exp.details && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                                {exp.details}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingWorkExp(exp);
                                setShowWorkExpForm(true);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteWorkExp(exp.work_exp_id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
                  <button
                    onClick={() => setShowSkillForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Add Skill
                  </button>
                </div>

                {showSkillForm && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Skill</h3>
                    <SkillSelector
                      onSubmit={handleAddSkill}
                      onCancel={() => setShowSkillForm(false)}
                      token={getToken()}
                    />
                  </div>
                )}

                {skills.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No skills added yet. Click "Add Skill" to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div
                        key={skill.skill_id}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{skill.skill_name}</h3>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {skill.level && <span>Level: {skill.level}/5</span>}
                            {skill.years_experience && <span>{skill.years_experience} years</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSkill(skill.skill_id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === "certifications" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Certifications</h2>
                  <button
                    onClick={() => setShowCertForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Add Certification
                  </button>
                </div>

                {showCertForm && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Certification</h3>
                    <CertificationForm
                      onSubmit={handleAddCert}
                      onCancel={() => setShowCertForm(false)}
                      token={getToken()}
                    />
                  </div>
                )}

                {certifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No certifications added yet. Click "Add Certification" to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certifications.map((cert) => (
                      <div
                        key={cert.cert_id}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{cert.cert_name}</h3>
                            {cert.credential_id && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Credential ID: {cert.credential_id}
                              </p>
                            )}
                            {(cert.issue_date || cert.expiry_date) && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                {cert.issue_date && `Issued: ${formatDate(cert.issue_date)}`}
                                {cert.issue_date && cert.expiry_date && " • "}
                                {cert.expiry_date && `Expires: ${formatDate(cert.expiry_date)}`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCert(cert.cert_id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    + Add Project
                  </button>
                </div>

                {showProjectForm && (
                  <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Project</h3>
                    <ProjectForm
                      onSubmit={handleAddProject}
                      onCancel={() => setShowProjectForm(false)}
                      token={getToken()}
                    />
                  </div>
                )}

                {projects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No projects added yet. Click "Add Project" to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.project_id}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {project.project_name}
                            </h3>
                            {project.project_description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {project.project_description}
                              </p>
                            )}
                            {project.project_url && (
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                              >
                                View Project →
                              </a>
                            )}
                            {(project.start_date || project.end_date) && (
                              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                {formatDate(project.start_date)} - {formatDate(project.end_date)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteProject(project.project_id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 ml-4"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Profile
          </button>
          <button
            onClick={() => router.push("/resumes/create")}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Create Resume →
          </button>
        </div>
      </div>
    </div>
  );
}
