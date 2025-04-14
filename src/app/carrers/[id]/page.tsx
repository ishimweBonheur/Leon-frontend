"use client";
import { useEffect, useState } from "react";
import { useJobs } from "@/Hooks/jobs";
import Link from "next/link";
import { useJobApplication } from "@/Hooks/applications";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  status: string;
  endDate: string;
  salary?: number;
  applicationsCount?: number;
  description: string;
}

interface JobDetailProps {
  job: Job;
}

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

  const daysLeft = job ? Math.max(0, Math.ceil((new Date(job.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
      console.log("Application submitted successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting application:", err);
      
    }
  };
  const { theme } = useTheme();

  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;

  if (loading || !job)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  


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
                <label htmlFor="name" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"/>
                      
              </div>

              <div>
                <label htmlFor="email" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                      
                />
              </div>

              <div>
                <label htmlFor="resume" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Upload Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  onChange={(e) =>
                    setFormData({ ...formData, resume: e.target.files ? e.target.files[0] : null })
                  }
                  required
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                />
              </div>

              <div>
                <label htmlFor="coverLetter" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
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
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                />
              </div>

              <div>
                <label htmlFor="portfolioUrl" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Portfolio URL (Optional)
                </label>
                <input
                  type="text"
                  id="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  GitHub URL (Optional)
                </label>
                <input
                  type="text"
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                />
              </div>

              <div>
                <label htmlFor="linkedInProfile" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="text"
                  id="linkedInProfile"
                  value={formData.linkedInProfile}
                  onChange={(e) => setFormData({ ...formData, linkedInProfile: e.target.value })}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                />
              </div>

              <div>
                <label htmlFor="additionalInfo" 
                        className="mb-3 block text-sm font-medium text-dark dark:text-white">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
                  rows={4}
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={applicationLoading}
                  className="rounded-lg bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
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
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="flex items-center text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      📍 {job.location}
                    </span>
              
                  </div>
                </div>

                {/* Status Badge with Pulse Animation */}
                <div
                  className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center ${
                    job.status === 'Available' ? 'bg-white text-emerald-600 animate-pulse' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {daysLeft} days left to apply
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-[#334155] p-4 rounded-lg">
                {job.salary && (
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                      <p className="font-medium">${job.salary.toLocaleString()}</p>
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
                    <p className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</p>
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
                    <p className="font-medium">{job.status || 'Open'}</p>
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
                  className="rounded-lg bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
                >
                  Apply now
                </button>
              </div>
            </div>
          </div>
          <div>
        <span className="absolute left-2 top-7">
          <svg
            width="57"
            height="65"
            viewBox="0 0 57 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z"
              fill="url(#paint0_linear_1028_600)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_600"
                x1="-18.3187"
                y1="55.1044"
                x2="37.161"
                y2="15.3509"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0.62"
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>

        <span className="absolute bottom-24 left-1.5">
          <svg
            width="39"
            height="32"
            viewBox="0 0 39 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M14.7137 31.4215L38.6431 4.24115L6.96581e-07 0.624124L14.7137 31.4215Z"
              fill="url(#paint0_linear_1028_601)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_601"
                x1="39.1948"
                y1="38.335"
                x2="10.6982"
                y2="10.2511"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0.62"
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>

        <span className="absolute right-2 top-[140px]">
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.5"
              d="M10.6763 35.3091C23.3976 41.6367 38.1681 31.7045 37.107 17.536C36.1205 4.3628 21.9407 -3.46901 10.2651 2.71063C-2.92254 9.69061 -2.68321 28.664 10.6763 35.3091Z"
              fill="url(#paint0_linear_1028_602)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1028_602"
                x1="-0.571054"
                y1="-37.1717"
                x2="28.7937"
                y2="26.7564"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0.62"
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>

        <span className="absolute right-0 top-0">
          <svg
            width="162"
            height="91"
            viewBox="0 0 162 91"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.3">
              <path
                opacity="0.45"
                d="M1 89.9999C8 77.3332 27.7 50.7999 50.5 45.9999C79 39.9999 95 41.9999 106 30.4999C117 18.9999 126 -3.50014 149 -3.50014C172 -3.50014 187 4.99986 200.5 -8.50014C214 -22.0001 210.5 -46.0001 244 -37.5001C270.8 -30.7001 307.167 -45 322 -53"
                stroke="url(#paint0_linear_1028_603)"
              />
              <path
                opacity="0.45"
                d="M43 64.9999C50 52.3332 69.7 25.7999 92.5 20.9999C121 14.9999 137 16.9999 148 5.49986C159 -6.00014 168 -28.5001 191 -28.5001C214 -28.5001 229 -20.0001 242.5 -33.5001C256 -47.0001 252.5 -71.0001 286 -62.5001C312.8 -55.7001 349.167 -70 364 -78"
                stroke="url(#paint1_linear_1028_603)"
              />
              <path
                opacity="0.45"
                d="M4 73.9999C11 61.3332 30.7 34.7999 53.5 29.9999C82 23.9999 98 25.9999 109 14.4999C120 2.99986 129 -19.5001 152 -19.5001C175 -19.5001 190 -11.0001 203.5 -24.5001C217 -38.0001 213.5 -62.0001 247 -53.5001C273.8 -46.7001 310.167 -61 325 -69"
                stroke="url(#paint2_linear_1028_603)"
              />
              <path
                opacity="0.45"
                d="M41 40.9999C48 28.3332 67.7 1.79986 90.5 -3.00014C119 -9.00014 135 -7.00014 146 -18.5001C157 -30.0001 166 -52.5001 189 -52.5001C212 -52.5001 227 -44.0001 240.5 -57.5001C254 -71.0001 250.5 -95.0001 284 -86.5001C310.8 -79.7001 347.167 -94 362 -102"
                stroke="url(#paint3_linear_1028_603)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_1028_603"
                x1="291.35"
                y1="12.1032"
                x2="179.211"
                y2="237.617"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.328125"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1028_603"
                x1="333.35"
                y1="-12.8968"
                x2="221.211"
                y2="212.617"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.328125"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1028_603"
                x1="294.35"
                y1="-3.89678"
                x2="182.211"
                y2="221.617"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.328125"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1028_603"
                x1="331.35"
                y1="-36.8968"
                x2="219.211"
                y2="188.617"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.328125"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                />
                <stop
                  offset="1"
                  stopColor={theme === "light" ? "#4A6CF7" : "#fff"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
        </div>

      </section>
    </>
  );
};

export default JobDetailPage;