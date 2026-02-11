import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { moveAsync, documentDirectory } from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RecordingMetadata {
    id: string;
    uri: string;
    durationMillis: number;
    timestamp: number;
    jobId: string;
    meetingType: string;
    participants: { role: string; name: string }[];
    consentGiven: boolean;
    uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed';
    analysis?: {
        editedSummary: {
            text: string;
            confidence: number;
            version: number;
        };
        rawTranscript: {
            speakerName: string;
            text: string;
            time: string;
            confidence: number;
        }[];
        editedTranscript?: {
            speakerName: string;
            text: string;
            time: string;
            confidence: number;
        }[];
        actionItems: {
            pm: (string | { title: string; ownerName?: string; dueDate?: string })[];
            otherParties: (string | { title: string; ownerName?: string; dueDate?: string })[];
        };
        quality?: {
            transcriptionConfidence: number;
            speakerRecognitionConfidence: number;
            actionExtractionConfidence: number;
            flags: string[];
        };
        audit?: {
            aiModel: string;
            processingTimestamp: string;
            specVersion: string;
        };
    };
    approval?: {
        status: 'pending' | 'approved' | 'discarded';
        timestamp: number;
        approver?: string;
    };
    history?: {
        timestamp: number;
        version: number;
        summary: string;
        editor: string;
    }[];
}

const METADATA_KEY = 'recordings_metadata';

export class StorageService {

    /**
     * Save a recording file from cache to a permanent location
     */
    async saveRecording(originalUri: string, metadata: Omit<RecordingMetadata, 'uri' | 'uploadStatus'>): Promise<RecordingMetadata> {
        let newPath = originalUri;

        if (Platform.OS !== 'web') {
            const fileName = originalUri.split('/').pop();
            newPath = documentDirectory + (fileName || `recording-${Date.now()}.m4a`);

            await moveAsync({
                from: originalUri,
                to: newPath
            });
        }

        const newRecord: RecordingMetadata = {
            ...metadata,
            uri: newPath,
            uploadStatus: 'pending'
        };

        await this.addMetadata(newRecord);
        return newRecord;
    }

    /**
     * Add metadata to the list of recordings
     */
    private async addMetadata(record: RecordingMetadata): Promise<void> {
        const existing = await this.getAllMetadata();
        existing.push(record);
        await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(existing));
    }

    /**
     * Get all recording metadata
     */
    async getAllMetadata(): Promise<RecordingMetadata[]> {
        const json = await AsyncStorage.getItem(METADATA_KEY);
        return json ? JSON.parse(json) : [];
    }

    /**
     * Update the status of a recording
     */
    async updateStatus(id: string, status: RecordingMetadata['uploadStatus'], analysis?: RecordingMetadata['analysis']): Promise<void> {
        return this.updateRecording(id, { uploadStatus: status, ...(analysis ? { analysis } : {}) });
    }

    /**
     * Generic update method for recording metadata
     */
    async updateRecording(id: string, updates: Partial<RecordingMetadata>): Promise<void> {
        const existing = await this.getAllMetadata();
        const index = existing.findIndex(r => r.id === id);
        if (index !== -1) {
            existing[index] = { ...existing[index], ...updates };
            await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(existing));
        }
    }

    /**
     * Get pending uploads
     */
    async getPendingUploads(): Promise<RecordingMetadata[]> {
        const all = await this.getAllMetadata();
        return all.filter(r => r.uploadStatus === 'pending' || r.uploadStatus === 'failed');
    }
}

export const storageService = new StorageService();
