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

export interface JobQueryResponse {
    answer?: string; // Or whatever structure n8n returns
    text?: string;
    output?: string;
}

export const jobsService = {
    /**
     * Sync a meeting analysis to the backend
     */
    syncMeeting: async (jobId: string, data: any): Promise<void> => {
        try {
            const token = await getToken();
            if (!token) {
                console.warn('No auth token found, cannot sync meeting to backend.');
                return;
            }

            console.log(`Syncing meeting for job ${jobId} to backend...`);
            const response = await fetch(`${API_URL}/jobs/${jobId}/meetings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to sync meeting:', errorData);
                // We don't throw here to avoid disrupting the user flow if backend sync fails but local save worked
            } else {
                console.log('Meeting synced successfully.');
            }
        } catch (error) {
            console.error('Network error syncing meeting:', error);
        }
    },

    /**
     * Ask a question to the Job Assistant
     */
    askJob: async (jobId: string, question: string): Promise<string> => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_URL}/jobs/${jobId}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ question }),
            });

            const rawText = await response.text();
            console.log('Backend Raw Response:', rawText);

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorJson = JSON.parse(rawText);
                    errorMessage = errorJson.message;
                } catch {
                    errorMessage = rawText;
                }
                throw new Error(errorMessage || 'Failed to get answer');
            }

            const data = JSON.parse(rawText);

            // Backend now guarantees { answer:string }
            return data.answer || JSON.stringify(data);

        } catch (error) {
            console.error('Error asking job:', error);
            throw error;
        }
    }
};
