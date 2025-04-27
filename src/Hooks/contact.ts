import { api, queryString } from './api';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string | Date;
}

export const useContact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle error
  const handleContactError = (error: any, action: string) => {
    console.error(`Error ${action}:`, error);
    setError(`Error ${action}. Please try again.`);
    toast.error(`Error ${action}. Please try again.`);
  };

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await api.get(`/contacts${queryString()}`);
      setContacts(response.data.tickets || []); 
    } catch (error: any) {
      handleContactError(error, 'fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  // Create a new contact ticket
  const createContact = async (name: string, email: string, message: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/contacts', { name, email, message });
      toast.success('Contact created successfully');
      return response.data;
    } catch (error: any) {
      handleContactError(error, 'creating contact ticket');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a contact by ID
  const getContactById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    } catch (error: any) {
      handleContactError(error, `fetching contact by ID (${id})`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact by ID
  const deleteContactById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/contacts/${id}`);
      toast.success('Contact deleted successfully');
      return response.data;
    } catch (error: any) {
      handleContactError(error, `deleting contact by ID (${id})`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    getContactById,
    deleteContactById,
  };
};
