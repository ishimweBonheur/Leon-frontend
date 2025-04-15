"use client";
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; 
import { api } from './api'; 
import { useJobApplication } from './applications';

interface Application {
  _id: string;
  user: {
    email: string;
  };
  status: string;
}

export const useSendEmail = (applications: Application[], fetchApplications: () => void) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
  ) => {
    try {
      await api.post('/api/email/send', {
        to,
        subject,
        text,
        html,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send email');
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      await fetchApplications();
      toast.success("Application status updated successfully");

      const application = applications.find(app => app._id === applicationId);
      console.log( application); 
      if (application) {
        const emailText = `Your application status has been updated to: ${status}`;
        const emailHtml = `<p>Your application status has been updated to: <strong>${status}</strong>.</p>`;

        await sendEmail(
          application.user.email,
          `Application Status Update`,
          emailText,
          emailHtml
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