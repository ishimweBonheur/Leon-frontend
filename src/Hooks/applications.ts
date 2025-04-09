import { useState } from "react";
import axios from "axios";
import { api } from "./api";

// ✅ Correctly structured interface based on your UI usage
interface JobApplication {
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

interface JobApplicationResponse {
  message: string;
}

export const useJobApplication = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const applyToJob = async (jobId: string, applicationData: Omit<JobApplication, "_id" | "job" | "user" | "status">) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<JobApplicationResponse>(
        `/applications/${jobId}/apply`,
        applicationData
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch<JobApplicationResponse>(
        `/api/jobApplications/${applicationId}/status`,
        { status }
      );

      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while updating the status.");
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByJob = async (jobId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<JobApplication[]>(`/api/jobApplications/by-job/${jobId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while retrieving applications.");
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<JobApplication[]>(`/api/jobApplications/by-user/${userId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while retrieving user applications.");
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByStatus = async (status: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<JobApplication[]>(
        `/api/jobApplications/by-status/${status}`
      );

      if (response.status === 200) {
        return response.data; 
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while retrieving applications by status.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );
      const url = response.data.secure_url;
      setFileUrl(url);
      return url;
    } catch (err) {
      setError("Failed to upload file");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    applyToJob,
    updateApplicationStatus,
    getApplicationsByJob,
    getApplicationsByUser,
    getApplicationsByStatus,
    uploadFile,
    fileUrl,
    loading,
    error,
  };
};
