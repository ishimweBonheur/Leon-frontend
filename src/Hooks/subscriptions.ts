import { api } from './api'; // your configured Axios instance
import { toast } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';

interface Subscription {
  _id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

// Utility to send a single email
const sendEmail = async (to: string, subject: string, message: string) => {
  try {
    await axios.post("/api/email", { to, subject, message });
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const useSubscription = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new subscription
  const createSubscription = async (data: { name: string; email: string }): Promise<Subscription> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/subscriptions', data);
      const newSub = response.data;
      setSubscriptions(prev => [...prev, newSub]);

      // Send confirmation email
      await sendEmail(
        newSub.email,
        "Thank you for subscribing!",
        `Hi ${newSub.name},\n\nThanks for subscribing to our newsletter!`
      );

      toast.success("Subscription created and email sent!");
      return newSub;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create subscription';
      toast.error(errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all subscriptions
  const getAllSubscriptions = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subscriptions';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get a subscription by ID
  const getSubscriptionById = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/subscriptions/${id}`);
      setSubscription(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subscription';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete a subscription by ID
  const deleteSubscription = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/subscriptions/${id}`);
      toast.success('Subscription deleted successfully!');
      setSubscriptions(prev => prev.filter(sub => sub._id !== id));
      if (subscription?._id === id) {
        setSubscription(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete subscription';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Send email to all current subscribers
  const sendEmailToAllSubscribers = async (subject: string, message: string) => {
    setLoading(true);
    try {
      for (const sub of subscriptions) {
        await sendEmail(sub.email, subject, message);
      }
      toast.success("Emails sent to all subscribers!");
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      toast.error("Failed to send emails to all subscribers.");
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    subscription,
    loading,
    error,
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    deleteSubscription,
    sendEmailToAllSubscribers, // ✅ added
  };
};
