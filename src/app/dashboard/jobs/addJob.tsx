"use client";

import { useJobs } from "@/Hooks/jobs";
import { useState, useEffect } from "react";

type Job = {
  id?: string;
  title: string;
  type: string;
  experience: string;
  location: string;
  salary: string;
  description: string;
  status: string;
  remainingDays: number;
};

type AddJobProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  editingJob: Job | null;
  addJob: (job: any) => Promise<void>;
  updateJob: (id: string, updatedJob: Job) => Promise<void>;
  refetch: () => void;
};

const AddJob = ({
  isModalOpen,
  closeModal,
  editingJob,
  addJob,
  updateJob,
  refetch,
}: AddJobProps) => {
  const { deleteJob, loading, error } = useJobs();

  const [jobDetails, setJobDetails] = useState<Job>({
    title: "",
    type: "Remote",
    experience: "Junior",
    location: "",
    salary: "",
    description: "",
    status: "Available",
    remainingDays: 30,
  });

  useEffect(() => {
    if (editingJob) {
      setJobDetails(editingJob);
    } else {
      setJobDetails({
        title: "",
        type: "Remote",
        experience: "Junior",
        location: "",
        salary: "",
        description: "",
        status: "Available",
        remainingDays: 30,
      });
    }
  }, [editingJob]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingJob && editingJob.id) {
      await updateJob(editingJob.id, jobDetails);
    } else {
      await addJob(jobDetails);
    }

    refetch();
    closeModal();
  };

  const handleDelete = async () => {
    if (editingJob && editingJob.id) {
      await deleteJob(editingJob.id);
      refetch();
      closeModal();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto p-6 rounded-lg overflow-y-auto max-h-[95vh]">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {editingJob ? "Edit Job" : "Add New Job"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />

          <input
            type="text"
            name="location"
            value={jobDetails.location}
            onChange={handleChange}
            placeholder="Job Location"
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />

          <textarea
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
            placeholder="Job Description"
            required
            rows={4}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white resize-none"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              name="type"
              value={jobDetails.type}
              onChange={handleChange}
              className="w-full sm:w-1/2 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
            </select>

            <select
              name="experience"
              value={jobDetails.experience}
              onChange={handleChange}
              className="w-full sm:w-1/2 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <input
            type="text"
            name="salary"
            value={jobDetails.salary}
            onChange={handleChange}
            placeholder="Salary Range"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Processing..." : editingJob ? "Update Job" : "Add Job"}
          </button>
        </form>

        {editingJob && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full mt-3 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
          >
            {loading ? "Deleting..." : "Delete Job"}
          </button>
        )}

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <button
          onClick={closeModal}
          className="w-full mt-4 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddJob;
