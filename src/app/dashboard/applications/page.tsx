"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useJobApplication } from "@/Hooks/applications";

interface Application {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  job: {
    _id: string;
    title: string;
  };
  cv: string;
  coverLetter: string;
  portfolioUrl: string;
  githubUrl: string;
  linkedInProfile: string;
  status: string;
}

export default function ManageApplicationsPage() {
  const { getApplicationsByStatus, updateApplicationStatus, loading, error } = useJobApplication();
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const applicationsPerPage = 5;
  const totalPages = Math.ceil(applications.length / applicationsPerPage);
  const applicationsToDisplay = applications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await getApplicationsByStatus("Pending");
        if (result) {
          setApplications(
            result.map((app: any) => ({
              _id: app._id,
              user: app.user,
              job: app.job,
              cv: app.cv,
              coverLetter: app.coverLetter,
              portfolioUrl: app.portfolioUrl,
              githubUrl: app.githubUrl,
              linkedInProfile: app.linkedInProfile,
              status: app.status,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(prevApps =>
        prevApps.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <section className="py-16 px-2 sm:px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-black dark:text-white">
          Manage Applications
        </h2>

        {/* Responsive table wrapper */}
        <div className="overflow-x-auto shadow-md rounded-lg dark:bg-gray-800 dark:text-white">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Applicant Name</th>
                <th className="py-3 px-4 text-left">Job Title</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Resume</th>
                <th className="py-3 px-4 text-left">Cover Letter</th>
                <th className="py-3 px-4 text-left">Portfolio</th>
                <th className="py-3 px-4 text-left">GitHub</th>
                <th className="py-3 px-4 text-left">LinkedIn</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicationsToDisplay.length > 0 ? (
                applicationsToDisplay.map((app) => (
                  <tr key={app._id} className="border-b dark:border-gray-600">
                    <td className="py-3 px-4">{app.user.name}</td>
                    <td className="py-3 px-4">{app.job.title}</td>
                    <td className="py-3 px-4">{app.user.email}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={app.cv}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={app.coverLetter}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View Cover Letter
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={app.portfolioUrl}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View Portfolio
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={app.githubUrl}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View GitHub
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={app.linkedInProfile}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View LinkedIn
                      </Link>
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        app.status === "Approved"
                          ? "text-green-600"
                          : app.status === "Rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {app.status}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleUpdateStatus(app._id, "Approved")}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app._id, "Rejected")}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-center" colSpan={10}>
                    {loading ? "Loading..." : "No applications found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
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
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </section>
  );
}
