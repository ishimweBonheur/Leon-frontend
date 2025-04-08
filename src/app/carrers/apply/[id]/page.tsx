"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useJobApplication } from "@/Hooks/applications";
import { toast } from "react-hot-toast";

const JobApplicationForm = () => {
  const params = useParams();
  const jobId = typeof params.id === "string" ? params.id : "";

  const { uploadFile, loading, error } = useJobApplication();

  const [cv, setCv] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [linkedInProfile, setLinkedInProfile] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cv || !coverLetter) {
      toast.error("Please upload both your CV and Cover Letter.");
      return;
    }

    try {
      toast.loading("Uploading files...");
      const cvUrl = await uploadFile(cv);
      const coverLetterUrl = await uploadFile(coverLetter);
      toast.dismiss();
      toast.success("Files uploaded successfully!");

      const applicationData = {
        jobId,
        cvUrl,
        coverLetterUrl,
        portfolioUrl,
        githubUrl,
        linkedInProfile,
      };

      console.log("Submitting job application...", applicationData);

      // Example API call
      // await axios.post(`/api/applications/${jobId}/apply`, applicationData);

      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit the application.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <label className="block mb-1 font-semibold">CV</label>
        <input
          type="file"
          onChange={(e) => setCv(e.target.files?.[0] || null)}
          required
          className="block w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Cover Letter</label>
        <input
          type="file"
          onChange={(e) => setCoverLetter(e.target.files?.[0] || null)}
          required
          className="block w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Portfolio URL</label>
        <input
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          className="block w-full border rounded px-3 py-2"
          placeholder="https://myportfolio.com"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">GitHub URL</label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="block w-full border rounded px-3 py-2"
          placeholder="https://github.com/username"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">LinkedIn Profile</label>
        <input
          type="url"
          value={linkedInProfile}
          onChange={(e) => setLinkedInProfile(e.target.value)}
          className="block w-full border rounded px-3 py-2"
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default JobApplicationForm;
