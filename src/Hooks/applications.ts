import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { api, queryString } from "./api";

interface JobApplication {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
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

export const useJobApplication = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/applications${queryString()}`);
      setApplications(response.data);
    } catch (error: any) {
      handleApplicationError(error, "fetching applications");
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (
    jobId: string,
    applicationData: Omit<JobApplication, "_id" | "job" | "user" | "status">
  ) => {
    setLoading(true);
    try {
      await api.post(`/applications/${jobId}/apply`, applicationData);
      toast.success("Application submitted successfully");
      fetchApplications();
    } catch (error: any) {
      handleApplicationError(error, "submitting application");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    console.log("Updating", applicationId, "to status", status); // 🧪 Add this
    setLoading(true);
    try 
    {await api.patch(`/applications/${applicationId}/status`, { status });
      fetchApplications();
      

      toast.success("Application status updated successfully");
    } catch (error: any) {
      handleApplicationError(error, "updating application status");
    } finally {
      setLoading(false);
    }
  };

  const getAllApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error: any) {
      handleApplicationError(error, "fetching all applications");
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByJob = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/applications/by-job/${jobId}`);
      return response.data;
    } catch (error: any) {
      handleApplicationError(error, "retrieving applications by job");
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/jobApplications/by-user/${userId}`);
      return response.data;
    } catch (error: any) {
      handleApplicationError(error, "retrieving user applications");
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByStatus = async (status: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/applications/status/${status}`);
      return response.data;
    } catch (error: any) {
      handleApplicationError(error, "retrieving applications by status");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        formData
      );
      const url = response.data.secure_url;
      setFileUrl(url);
      toast.success("File uploaded successfully");
      return url;
    } catch (error) {
      toast.error("Failed to upload file");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationError = (error: any, action: string) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      `An error occurred while ${action}.`;
    setError(message);
    console.error(`Error while ${action}:`, error); // Added logging for debugging
  };

  return {
    applications,
    loading,
    error,
    fileUrl,
    refetch: fetchApplications,
    applyToJob,
    updateApplicationStatus,
    getApplicationsByJob,
    getApplicationsByUser,
    getApplicationsByStatus,
    getAllApplications,
    uploadFile,
  };
};
