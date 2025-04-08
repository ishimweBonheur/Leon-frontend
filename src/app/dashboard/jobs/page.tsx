"use client";
import { useJobs } from "@/Hooks/jobs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Job = {
  _id: string;
  id?: number;
  title: string;
  description: string;
  location: string;
  company: string;
  endDate: string;
  employmentType: string;
  salary: number;
  remote: boolean;
  status: "Open" | "Closed";
  requirements?: string[];
  responsibilities?: string[];
};

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { jobs, loading, addJob, updateJob, deleteJob, refetch } = useJobs();

  useEffect(() => {
    refetch();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || job.employmentType === filterType;
    return matchesSearch && matchesType;
  });

  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const jobsToDisplay = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete._id);
      setJobToDelete(null);
      toast.success("Job deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const job: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      company: formData.get("company") as string,
      endDate: formData.get("endDate") as string,
      employmentType: formData.get("employmentType") as string,
      salary: Number(formData.get("salary")),
      remote: formData.get("remote") === "on",
      status: formData.get("status") as "Open" | "Closed",
    };
  
    try {
      if (editingJob && editingJob._id) {
        await updateJob(editingJob._id, job);
        toast.success("Job updated successfully");
      } else {
        await addJob(job);
        toast.success("Job added successfully");
      }
      setIsModalOpen(false);
      setEditingJob(null);
      refetch();
    } catch (err) {
      console.error("Error submitting job:", err);
      toast.error("Failed to submit job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="jobs">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Manage Jobs</h2>

        {/* Search & Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="search"
            placeholder="Search for a job..."
            className="w-full sm:w-3/4 border rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto border rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Add Job Button */}
        <div className="flex justify-start mb-4">
          <button
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded"
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
          >
            + Add Job
          </button>
        </div>

        {/* Job Table */}
        <div className="overflow-auto bg-white shadow-md rounded-lg dark:bg-gray-800">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Employment Type</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Salary</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 dark:text-gray-300">
              {jobsToDisplay.map((job) => (
                <tr key={job._id} className="border-b dark:border-gray-600">
                  <td className="py-3 px-4">{job.title}</td>
                  <td className="py-3 px-4">{job.company}</td>
                  <td className="py-3 px-4">{job.employmentType}</td>
                  <td className="py-3 px-4">{job.location}</td>
                  <td className="py-3 px-4">${job.salary}</td>
                  <td className={`py-3 px-4 font-semibold ${job.status === "Open" ? "text-green-600" : "text-red-500"}`}>
                    {job.status}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button onClick={() => handleEdit(job)} className="bg-blue-600 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => setJobToDelete(job)} className="bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this job?</p>
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setJobToDelete(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
  <div className="fixed inset-0 flex  justify-center bg-black bg-opacity-50 z-50 ">
    <form
      onSubmit={handleFormSubmit}
      className="bg-white dark:bg-gray-dark rounded-lg shadow-lg w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-h-full overflow-y-auto p-6 space-y-6 "
    >
      <h3 className="text-xl font-bold text-center text-dark dark:text-white">
        {editingJob ? "Edit Job" : "Add Job"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start flex-start">

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Job Title
          </label>
          <input
            name="title"
            defaultValue={editingJob?.title}
            placeholder="Job Title"
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Job Description
          </label>
          <input
            name="description"
            defaultValue={editingJob?.description}
            placeholder="Job Description"
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Location
          </label>
          <input
            name="location"
            defaultValue={editingJob?.location}
            placeholder="Location"
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Company
          </label>
          <input
            name="company"
            defaultValue={editingJob?.company}
            placeholder="Company"
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Application Deadline
          </label>
          <input
            name="endDate"
            type="date"
            defaultValue={editingJob?.endDate}
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Employment Type
          </label>
          <select
            name="employmentType"
            defaultValue={editingJob?.employmentType}
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          >
            <option value="">Select Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="flex text-sm font-medium text-dark dark:text-white mb-1">
            Salary
          </label>
          <input
            name="salary"
            type="number"
            defaultValue={editingJob?.salary}
            placeholder="e.g. 50000"
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="flex  text-sm font-medium text-dark dark:text-white mb-1 ">
            Status
          </label>
          <select
            name="status"
            defaultValue={editingJob?.status}
            required
            className="w-full rounded-sm border border-stroke bg-[#f8f8f8] dark:bg-[#2C303B] dark:border-transparent text-body-color dark:text-body-color-dark px-4 py-2 outline-none focus:border-primary"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <input
            name="remote"
            type="checkbox"
            defaultChecked={editingJob?.remote}
            className="accent-primary focus:ring-primary w-5 h-5"
          />
          <label className="text-sm font-medium text-dark dark:text-white">
            Remote
          </label>
        </div>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className=" py-2 bg-gray-400 rounded-sm  w-full text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        </div>
        <div className="flex justify-center space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className=" py-2 rounded-sm w-full bg-primary text-white hover:bg-primary/90 shadow-submit dark:shadow-submit-dark"
        >
          {isSubmitting ? "Processing..." : editingJob ? "Update" : "Create"}
        </button>
      </div>
    </form>
  </div>
)}



    </section>
  );
}