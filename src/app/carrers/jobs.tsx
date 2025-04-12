"use client";

import { useEffect, useState } from "react";
import {useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api } from "@/Hooks/api"; // Ensure this is correctly configured
import { useJobs } from "@/Hooks/jobs";

const JobDetail = () => {
  const { id } = useParams(); 
  const router = useRouter();
  const [error, setError] = useState<any>(null);
  const {jobs, loading,refetch} =  useJobs()

useEffect(() => {
refetch()
}, [])
const job = jobs.find((job) => job._id === id);

  if (error) return <p className="text-center py-10 text-red-500">{error.message || "Error loading job."}</p>;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">
          Job Details
        </h2>

        {job ? (
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
              {job.title}
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Work Type:</strong> {job.type}</p>
              <p><strong>Experience:</strong> {job.experience} Level</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Application Status:</strong> {job.status === "Available" ? "Open" : "Closed"}</p>
              <p><strong>Deadline:</strong> {job.remainingDays} days left</p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push("/careers")}
                className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Job not found.</p>
        )}
      </div>
    </section>
  );
};

export default JobDetail;
