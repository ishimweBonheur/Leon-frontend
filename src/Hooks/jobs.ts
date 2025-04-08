import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, queryString } from './api';
import { storage } from '@/utils/storage';

export const useJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    // Fetch jobs
    const fetchJobs = async (query?: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/jobs${queryString(query)}`);
            setJobs(response.data);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

 
    const addJob = async (job: any) => {
        setLoading(true);
        try {
            await api.post('/jobs', job);
            fetchJobs();
            toast.success('Job Created successfully');
        } catch (error: any) {
            handleJobError(error);
        } finally {
            setLoading(false);
        }
    };

    // Update a job
    const updateJob = async (id: string, job: any) => {
        setLoading(true);
        try {
            await api.put(`/jobs/${id}`, job);
            toast.success('Job Updated');
            fetchJobs(); // Refetch jobs after updating
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Delete a job
    const deleteJob = async (id: string) => { 
        setLoading(true);
        try {
            await api.delete(`/jobs/${id}`);
            fetchJobs(); // Refetch jobs after deletion
            toast.success('Job Deleted');
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Error handling function
    const handleJobError = (error: any) => {
        if (error.response) {
            const { error: errorMessage } = error.response.data;
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.error('Failed to create job. Please try again later.');
            }
        } else {
            toast.error('An unexpected error occurred. Please try again later.');
        }
        setError(error);
    };

    return {
        jobs,
        loading,
        error,
        addJob,
        updateJob,
        deleteJob,
        refetch: fetchJobs,
    };
};
