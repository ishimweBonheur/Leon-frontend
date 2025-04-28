import { api } from './api'; // assuming you have axios instance as api
import { toast } from 'react-toastify';
import { useState } from 'react'; 

interface Subscription {
  _id: string;
  name: string;
  email: string;
  createdAt: string | Date;
}

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
      setSubscriptions(prev => [...prev, response.data]);
      return response.data;
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

  return {
    subscriptions,
    subscription,
    loading,
    error,
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    deleteSubscription,
  };
};