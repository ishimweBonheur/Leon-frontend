import { useState } from "react";
import axios from "axios";
import { api } from "./api";

interface JobApplication {
  user: string;
  job: string;
  cv: string;
  coverLetter: string;
  portfolioUrl: string;
  githubUrl: string;
  linkedInProfile: string;
}

interface JobApplicationResponse {
  message: string;
}

export const useJobApplication = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle job application submission
  const applyToJob = async (jobId: string, applicationData: JobApplication) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<JobApplicationResponse>(
        `/applications/${jobId}/apply`,
        applicationData
      );

      // if (response.status === 201) {
      //   alert(response.data.message);
      //   router.push("/applications"); // Redirect after successful application
      // }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  // Function to update application status
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

  // Function to get applications by job ID
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

  // Function to get applications by user ID
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

  // Function to get applications by status
  const getApplicationsByStatus = async (status: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<JobApplication[]>(`/api/jobApplications/by-status/${status}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while retrieving applications by status.");
    } finally {
      setLoading(false);
    }
  };
    const [fileUrl, setFileUrl] = useState<string | null>(null);
  
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
      uploadFile,        // ✅ Add this
  fileUrl, 
    loading,
    error,
  };
};
