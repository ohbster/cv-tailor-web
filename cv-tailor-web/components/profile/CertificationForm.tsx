"use client";

import { useState, useEffect } from "react";
import { Certification, CandidateCertificationCreate, certificationsAPI } from "@/lib/api";

interface CertificationFormProps {
  onSubmit: (data: CandidateCertificationCreate) => Promise<void>;
  onCancel: () => void;
  token: string;
}

export default function CertificationForm({ onSubmit, onCancel, token }: CertificationFormProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [formData, setFormData] = useState<CandidateCertificationCreate>({
    cert_id: "",
    credential_id: "",
    issue_date: "",
    expiry_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await certificationsAPI.getAll();
      setCertifications(data);
    } catch (err: any) {
      setError("Failed to load certifications");
    } finally {
      setLoadingCerts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cert_id) {
      setError("Please select a certification");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to add certification");
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

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Certification <span className="text-red-500">*</span>
        </label>
        {loadingCerts ? (
          <div className="text-sm text-gray-500">Loading certifications...</div>
        ) : (
          <select
            required
            value={formData.cert_id}
            onChange={(e) => setFormData({ ...formData, cert_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a certification...</option>
            {certifications.map((cert) => (
              <option key={cert.cert_id} value={cert.cert_id}>
                {cert.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Credential ID
        </label>
        <input
          type="text"
          value={formData.credential_id || ""}
          onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g. ABC123XYZ"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            value={formData.issue_date || ""}
            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            value={formData.expiry_date || ""}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
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
          disabled={loading || loadingCerts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Certification"}
        </button>
      </div>
    </form>
  );
}
