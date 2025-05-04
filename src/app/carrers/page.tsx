"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useJobs } from "@/Hooks/jobs";

const HomePage = () => {
  const { jobs, loading, error, refetch } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    refetch();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || job.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const jobsToDisplay = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <section className="relative mt-20 py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Floating Background SVGs */}
      <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
        <svg className="absolute top-16 left-1/4 w-[150px] animate-float" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="#3B82F6" strokeWidth="10" />
        </svg>
        <svg className="absolute bottom-16 right-1/4 w-[200px] animate-float-delay" viewBox="0 0 300 300" fill="none">
          <rect x="50" y="50" width="200" height="200" stroke="#10B981" strokeWidth="8" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-16 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white">
            Find Your <span className="text-blue-600">Dream Job</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse through our latest job openings and take the next step in your career
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full px-4 sm:px-0 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-3/4">
            <input
              type="text"
              placeholder="Search for jobs by title or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm sm:text-base text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-1/4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm sm:text-base text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
            >
              <option value="All">All Job Types</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 px-4 text-sm text-gray-600 dark:text-gray-300">
            Showing {jobsToDisplay.length} of {filteredJobs.length} jobs
          </div>
        )}

        {/* Job List or Loader */}
        <div className="space-y-6 px-4 sm:px-0">
          {loading ? (
            Array.from({ length: jobsPerPage }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow animate-pulse h-40" />
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-10 w-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No jobs found. Try changing your search or filters.</p>
            </div>
          ) : (
            jobsToDisplay.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 text-sm mb-4">
                      <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        📍 {job.location}
                      </span>
                      <span className="badge bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        🧑‍💼 {job.type}
                      </span>
                      <span className={`badge ${
                        job.status === "Available"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {job.description.length > 200
                        ? `${job.description.slice(0, 200)}...`
                        : job.description}
                    </p>
                  </div>
                  <div className="md:col-span-1 flex flex-col items-start md:items-end justify-between">
                    <Link
                      href={`/carrers/${job._id}`}
                      className="inline-block px-6 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      View Details →
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Posted: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {(currentPage - 1) * jobsPerPage + 1} to{" "}
              {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of{" "}
              {filteredJobs.length} results
            </p>
            <div className="flex gap-1 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm rounded border ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 7s ease-in-out infinite 1s;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
};

export default HomePage;
