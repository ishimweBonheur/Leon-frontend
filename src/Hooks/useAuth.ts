import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, queryString } from './api';
import { storage } from '@/utils/storage';
import { jwtDecode } from 'jwt-decode';

export const baseURL = 'https://localhost:8000';

// =============================
// Email/Password Login
// =============================
export const useLogin = () => {
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const login = async (credentials: { email: string; password: string }) => {
        setLoadingLogin(true);
        setLoginError(null);
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            storage.setToken(token);
            localStorage.setItem('Leon_user', JSON.stringify(user));
            setLoginSuccess(true);

            console.log(response);

            if (user.role === 'admin') {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/';
            }

            return response.data;
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error || 'An error occurred during login.';
            toast.error(errorMessage);
            setLoginError(errorMessage);
        } finally {
            setLoadingLogin(false);
        }
    };

    return {
        loadingLogin,
        login,
        loginSuccess,
        loginError,
    };
};

// =============================
// Google Login
// =============================
export const loginWithGoogle = async (googleToken: string) => {
    try {
        const response = await api.post('/auth/google', {
            tokenId: googleToken, // Ensure this matches the backend
        });

        const { token, user, isNew } = response.data;

        // Save token and user data in local storage
        storage.setToken(token);
        localStorage.setItem('Leon_user', JSON.stringify(user));

        // Redirect based on user role
        if (user.role === 'admin') {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/';
        }

        // Show appropriate toast message
        toast.success(isNew ? 'Registered successfully with Google' : 'Logged in with Google');
        return user;
    } catch (error: any) {
        const msg = error.response?.data?.error || 'Google login/registration failed.';
        toast.error(msg);
        console.error(msg);
    }
};



// =============================
// Check if Logged In
// =============================
export const isLoggedIn = () => {
    if (typeof window === 'undefined') return false;
    const token = storage.getToken();
    if (token) {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            storage.removeToken();
            localStorage.removeItem('Leon_user');
            return false;
        }

        const user = localStorage.getItem('Leon_user');
        if (user) {
            return JSON.parse(user);
        }
    }
    return false;
};

// =============================
// User CRUD (Admin)
// =============================
export const useUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchUsers = async (query?: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/users${queryString(query)}`);
            setUsers(response.data);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (user: any) => {
        setLoading(true);
        try {
            await api.post('/auth/register', user);
            fetchUsers();
            toast.success('User Created successfully');
        } catch (error: any) {
            handleUserError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, user: any) => {
        setLoading(true);
        try {
            await api.put(`/users/${id}`, user);
            toast.success('User Updated');
            fetchUsers();
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        setLoading(true);
        try {
            await api.delete(`/users/${id}`);
            fetchUsers();
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserError = (error: any) => {
        if (error.response) {
            const { error: errorMessage, message } = error.response.data;
            if (errorMessage) {
                toast.error(errorMessage);
            } else if (message === 'An account with this phone address already exists.') {
                toast.error('An account with this phone number already exists.');
            } else {
                toast.error('Failed to create user. Please try again later.');
            }
        } else {
            toast.error('An unexpected error occurred. Please try again later.');
        }
        setError(error);
    };

    return {
        users,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        refetch: fetchUsers,
    };
};
