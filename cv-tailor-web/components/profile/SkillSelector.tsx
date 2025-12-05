"use client";

import { useState, useEffect, useRef } from "react";
import { Skill, CandidateSkillCreate, skillsAPI } from "@/lib/api";

interface SkillSelectorProps {
  onSubmit: (data: CandidateSkillCreate) => Promise<void>;
  onCancel: () => void;
  token: string;
}

export default function SkillSelector({ onSubmit, onCancel, token }: SkillSelectorProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [formData, setFormData] = useState<CandidateSkillCreate>({
    skill_id: "",
    level: undefined,
    years_experience: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSkills([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchSkills(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const searchSkills = async (query: string) => {
    setLoadingSkills(true);
    try {
      const response = await fetch(`http://localhost:8000/skills/?search=${encodeURIComponent(query)}&limit=20`);
      if (!response.ok) throw new Error("Failed to search skills");
      const data = await response.json();
      setSkills(data);
      setShowDropdown(true);
    } catch (err: any) {
      setError("Failed to search skills");
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setSearchQuery(skill.name);
    setFormData({ ...formData, skill_id: skill.skill_id });
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skill_id) {
      setError("Please select a skill");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      // Reset form
      setSearchQuery("");
      setSelectedSkill(null);
      setFormData({
        skill_id: "",
        level: undefined,
        years_experience: undefined,
      });
    } catch (err: any) {
      setError(err.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Skill <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (selectedSkill) {
              setSelectedSkill(null);
              setFormData({ ...formData, skill_id: "" });
            }
          }}
          onFocus={() => {
            if (skills.length > 0) setShowDropdown(true);
          }}
          placeholder="Start typing to search (min. 2 characters)..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        
        {loadingSkills && searchQuery.length >= 3 && (
          <div className="absolute right-3 top-9 text-sm text-gray-500">
            Searching...
          </div>
        )}

        {showDropdown && skills.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {skills.map((skill) => (
              <button
                key={skill.skill_id}
                type="button"
                onClick={() => handleSkillSelect(skill)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {skill.name}
              </button>
            ))}
          </div>
        )}

        {searchQuery.length >= 3 && !loadingSkills && skills.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg px-3 py-2 text-sm text-gray-500">
            No skills found matching "{searchQuery}"
          </div>
        )}

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Type at least 3 characters to search
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Proficiency Level (1-5)
        </label>
        <select
          value={formData.level || ""}
          onChange={(e) => setFormData({ ...formData, level: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Not specified</option>
          <option value="1">1 - Beginner</option>
          <option value="2">2 - Elementary</option>
          <option value="3">3 - Intermediate</option>
          <option value="4">4 - Advanced</option>
          <option value="5">5 - Expert</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Years of Experience
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={formData.years_experience || ""}
          onChange={(e) => setFormData({ ...formData, years_experience: e.target.value ? parseFloat(e.target.value) : undefined })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g. 3.5"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !selectedSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Skill"}
        </button>
      </div>
    </form>
  );
}
