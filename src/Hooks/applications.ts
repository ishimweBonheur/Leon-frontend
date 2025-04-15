import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { api, queryString } from "./api";

interface JobApplication {
  createdAt: any;
  updatedAt: string | number | Date;
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

  // Fetching all job applications
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

  // Apply to a job and send email notification
  const applyToJob = async (
    jobId: string,
    applicationData: Omit<JobApplication, "_id" | "job" | "user" | "status">,
    userEmail: string
  ) => {
    setLoading(true);
    try {
      await api.post(`/applications/${jobId}/apply`, applicationData);
      sendEmail(userEmail, "Job Application Submitted", "You have successfully applied to the job.");
      toast.success("Application submitted successfully");
      fetchApplications();
    } catch (error: any) {
      handleApplicationError(error, "submitting application");
    } finally {
      setLoading(false);
    }
  };

  // Update application status and send email notification
  const updateApplicationStatus = async (applicationId: string, status: string) => {
    console.log("Updating", applicationId, "to status", status); // 🧪 Add this
    setLoading(true);
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      fetchApplications();
      toast.success("Application status updated successfully");
      
      // Send email to the user after status update
      const application = applications.find(app => app._id === applicationId);
      if (application) {
        sendEmail(application.user.email, "Application Status Updated", `Your application status has been updated to: ${status}`);
      }
    } catch (error: any) {
      handleApplicationError(error, "updating application status");
    } finally {
      setLoading(false);
    }
  };

  // Send an email (you can use a service like SendGrid or Nodemailer here)
  const sendEmail = async (to: string, subject: string, message: string) => {
    try {
      await axios.post("/api/email", { to, subject, message });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const getAllApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error: any) {
      handleApplicationError(error, "fetching all applications");
    } finally {
      setLoading(false);
    }
  }, []);

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
    console.error(`Error while ${action}:`, error);
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
