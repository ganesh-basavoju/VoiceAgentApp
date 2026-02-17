import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { API_BASE_URL } from '../constants/Config';

const API_URL = API_BASE_URL;

const getToken = async () => {
    try {
        if (Platform.OS === 'web') {
            return localStorage.getItem('token');
        } else {
            return await SecureStore.getItemAsync('token');
        }
    } catch (error) {
        console.error('Error getting token', error);
        return null;
    }
};

export interface User {
    id: string;
    email: string;
    fullName: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

// Add to interface
export interface UserProfile {
    user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        createdAt: string;
    };
    stats: {
        notesCount: number;
        jobsCount: number;
        rating: number;
    };
}

export const authService = {
    getProfile: async (): Promise<UserProfile> => {
        const token = await getToken();

        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
        return data;
    },
    signIn: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    signUp: async (fullName: string, email: string, password: string): Promise<void> => {
        try {
            console.log(`Attempting to sign up at ${API_URL}/auth/register with`, { fullName, email });
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Registration failed:', data);
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Network or Server Error:', error);
            throw error;
        }
    },

    requestPasswordReset: async (email: string): Promise<void> => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Request failed');
    },

    verifyOtp: async (email: string, otp: string): Promise<void> => {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Invalid OTP');
    },

    updatePassword: async (email: string, newPassword: string, otp?: string): Promise<void> => {
        // We might need to pass OTP here depending on backend logic
        // Updated backend requires OTP for reset-password
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
    }
};
