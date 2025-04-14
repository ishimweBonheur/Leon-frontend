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
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">
          Available Jobs
        </h2>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          {loading ? (
            <div className="w-full md:w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse h-12"></div>
          ) : (
            <input
              type="text"
              placeholder="Search For Job ...."
              className="w-full md:w-3/4 border border-stroke rounded-lg px-6 py-3 bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {loading ? (
            <div className="w-1/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse h-12"></div>
          ) : (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-stroke rounded-lg px-6 py-3 bg-[#f8f8f8] dark:bg-[#2C303B] dark:text-white"
            >
              <option value="All">All Job Types</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
            </select>
          )}
        </div>

        {/* Skeleton Loader for Job Listings */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: jobsPerPage }).map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 animate-pulse">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                  </div>
                  <div className="col-span-1">
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Job Cards
          <div className="grid grid-rows-1 md:grid-rows-2 gap-6">
            {jobsToDisplay.map((job) => (
              <div
                key={job._id}
                className="rounded-xl bg-white dark:bg-[#1E1E2F] shadow-md p-6 transition hover:shadow-lg"
              >
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                      Title: {job.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Location: {job.location}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Type: {job.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Description: {job.description.length > 150
                        ? `${job.description.substring(0, 150)}...`
                        : job.description}
                    </p>
                    <p
                      className={`text-sm font-medium ${job.status === "Available" ? "text-green-600" : "text-red-500"}`}
                    >
                      Status: {job.status}
                    </p>
                  </div>
                  <div className="col-span-1 flex flex-col justify-between items-start gap-3">
                    <Link
                      href={`/carrers/${job._id}`}
                      className={`px-4 py-2 w-1/2 text-center rounded-full text-sm font-medium bg-gray-200 text-blue-500 hover:text-blue-900 md:bg-transparent`}
                    >
                      View
                    </Link>
                    <p className="text-md text-green-500 mt-2">Active</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Skeleton Loader */}
        {loading ? (
          <div className="flex justify-center mt-8 space-x-2">
            <div className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse h-12 w-16"></div>
            <div className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse h-12 w-16"></div>
            <div className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse h-12 w-16"></div>
          </div>
        ) : (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${currentPage === page
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Background SVGs */}
      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
        <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
          <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_25:217)" />
          <circle cx="76.9997" cy="288" r="34" fill="url(#paint2_radial_25:217)" />
          <circle cx="325.486" cy="302.87" r="180" transform="rotate(-37.6852 325.486 302.87)" fill="url(#paint3_linear_25:217)" />
          <circle opacity="0.8" cx="184.521" cy="315.521" r="132.862" transform="rotate(114.874 184.521 315.521)" stroke="url(#paint4_linear_25:217)" />
          <circle opacity="0.8" cx="356" cy="290" r="179.5" transform="rotate(-30 356 290)" stroke="url(#paint5_linear_25:217)" />
          <circle opacity="0.8" cx="191.659" cy="302.659" r="133.362" transform="rotate(133.319 191.659 302.659)" fill="url(#paint6_linear_25:217)" />
          <defs>
            <linearGradient id="paint0_linear_25:217" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="paint1_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9997 182) rotate(90) scale(18)">
              <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="paint2_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(76.9997 288) rotate(90) scale(34)">
              <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="paint3_linear_25:217" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint4_linear_25:217" x1="184.521" y1="182.159" x2="184.521" y2="448.882" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint5_linear_25:217" x1="356" y1="110" x2="356" y2="470" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint6_linear_25:217" x1="118.524" y1="29.2497" x2="166.965" y2="338.63" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default HomePage;
