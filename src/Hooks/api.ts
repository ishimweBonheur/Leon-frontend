import { storage } from '@/utils/storage';
import axios from 'axios';

// Corrected baseURL with proper template string
export const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;


export const api = axios.create({
  baseURL: `${baseURL}/api`,
});

// Axios request interceptor for attaching token
api.interceptors.request.use(
  (config) => {
    const tokenId = storage.getToken();
    if (tokenId) {
      config.headers.Authorization = `Bearer ${tokenId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility to handle optional query strings
export const queryString = (query?: string): string => {
  return query ? `?${query}` : '';
};
