"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "./api";
import { emailTemplates } from "@/utils/emailTemplates";

interface Application {
  _id: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  job?: {
    title: string;
  };
  status: string;
}
export const useSendEmail = (applications: Application[], fetchApplications: () => void) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
  ) => {
    try {
      await api.post("/email/send", {
        to,
        subject,
        text,
        html,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send email");
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      await fetchApplications();
      toast.success("Application status updated successfully");

      const application = applications.find((app) => app._id === applicationId);

      if (application) {
        const jobTitle = application.job?.title || "Unknown Position";
        const applicationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/applications/${application._id}`;

        const { subject, text, html } = emailTemplates.applicationStatusUpdate(
          status,
          jobTitle,
          application.user.firstName,

          applicationLink
        );

        await sendEmail(
          application.user.email,
          subject,
          text,
          html
        );
      }
    } catch (error: any) {
      console.error("Error updating application:", error);
      toast.error(error.response?.data?.message || "Failed to update application");
    } finally {
      setLoading(false);
    }
  };

  return {
    updateApplicationStatus,
    loading,
    successMessage,
    errorMessage,
  };
};
