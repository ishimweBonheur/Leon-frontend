"use client";
import { useEffect, useState } from "react";
import { useJobs } from "@/Hooks/jobs";
import Link from "next/link";
import { useJobApplication } from "@/Hooks/applications";
import { useParams } from "next/navigation";

const JobDetailPage = () => {
  const params = useParams();
  const id = params.id;
  const { jobs, loading, error, refetch } = useJobs();
  const {
    applyToJob,
    uploadFile,
    loading: applicationLoading,
    error: applicationError,
  } = useJobApplication();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null as File | null,
    coverLetter: null as File | null,
    portfolioUrl: "",
    githubUrl: "",
    linkedInProfile: "",
    additionalInfo: "",
  });

  useEffect(() => {
    refetch();
  }, []);

  const job = jobs.find((job) => job._id === id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload files to Cloudinary first
      const resumeUrl = formData.resume ? await uploadFile(formData.resume) : "";
      const coverLetterUrl = formData.coverLetter ? await uploadFile(formData.coverLetter) : "";

      // Prepare application data
      const applicationData = {
        user: formData.email, // Or use user ID if logged in
        job: id as string,
        cv: resumeUrl,
        coverLetter: coverLetterUrl,
        portfolioUrl: formData.portfolioUrl,
        githubUrl: formData.githubUrl,
        linkedInProfile: formData.linkedInProfile,
        additionalInfo: formData.additionalInfo,
      };

      // Submit application using the hook
      await applyToJob(id as string, applicationData);
      
      // Reset form and close modal on success
      setFormData({
        name: "",
        email: "",
        resume: null,
        coverLetter: null,
        portfolioUrl: "",
        githubUrl: "",
        linkedInProfile: "",
        additionalInfo: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Application failed:", err);
    }
  };
  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  return (
    <>
      {/* MODAL OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1E293B] rounded-lg p-6 w-full max-w-3xl z-50 relative  overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Apply for {job.title}</h2>

            {/* Job Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-4">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 ">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                  Upload Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  onChange={(e) =>
                    setFormData({ ...formData, resume: e.target.files ? e.target.files[0] : null })
                  }
                  required
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                  Cover Letter (Optional)
                </label>
                <input
                  type="file"
                  id="coverLetter"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverLetter: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700">
                  Portfolio URL (Optional)
                </label>
                <input
                  type="text"
                  id="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                  GitHub URL (Optional)
                </label>
                <input
                  type="text"
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="linkedInProfile" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="text"
                  id="linkedInProfile"
                  value={formData.linkedInProfile}
                  onChange={(e) => setFormData({ ...formData, linkedInProfile: e.target.value })}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  rows={4}
                ></textarea>
              </div>

              <div className="flex justify-center">
              <button
                  type="submit"
                  disabled={applicationLoading}
                  className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                    applicationLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {applicationLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOB DETAIL CONTENT */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="flex items-center text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      📍 {job.location}
                    </span>
                    <span className="flex items-center text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      🏢 {job.type}
                    </span>
                    <span className="flex items-center text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      🎯 {job.experience} Level
                    </span>
                  </div>
                </div>

                {/* Status Badge with Pulse Animation */}
                <div className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center ${job.status === "Available"
                  ? "bg-white text-emerald-600 animate-pulse"
                  : "bg-gray-800 text-gray-300"
                  }`}>
                    <>
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {job.remainingDays} days left to apply
                    </>
            
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-[#334155] p-4 rounded-lg">
                {job.salary && (
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Posted</p>
                    <p className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Applications</p>
                    <p className="font-medium">{job.applicationsCount || "Open"}</p>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-blue-500 mr-2 rounded-full"></span>
                  Job Description
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  {job.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>



              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/carrers"
                  className="px-6 py-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Jobs
                </Link>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/30 cursor-pointer"
                >
                  Apply now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetailPage;
