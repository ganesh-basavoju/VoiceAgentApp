import { Platform } from 'react-native';

import { API_BASE_URL } from '../constants/Config';

const API_URL = API_BASE_URL;

export interface User {
    id: string;
    email: string;
    fullName: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

export const authService = {
    signIn: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/login`, {
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
            console.log(`Attempting to sign up at ${API_URL}/register with`, { fullName, email });
            const response = await fetch(`${API_URL}/register`, {
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
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Request failed');
    },

    verifyOtp: async (email: string, otp: string): Promise<void> => {
        const response = await fetch(`${API_URL}/verify-otp`, {
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
        const response = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
    }
};
