import { Platform } from 'react-native';
import { RecordingMetadata, storageService } from './storage';

// Production Webhook URL
const N8N_WEBHOOK_URL = 'https://n8n.srv1234562.hstgr.cloud/webhook/56de15fe-5286-4bda-880a-e67c5aa87aa4';

export class UploadService {

    async uploadRecording(metadata: RecordingMetadata): Promise<boolean> {
        try {
            await storageService.updateStatus(metadata.id, 'uploading');
            console.log(`Starting upload to: ${N8N_WEBHOOK_URL} (Job: ${metadata.jobId})`);

            const formData = new FormData();

            if (Platform.OS === 'web') {
                const response = await fetch(metadata.uri);
                const blob = await response.blob();
                formData.append('file', blob, 'recording.m4a');
            } else {
                formData.append('file', {
                    uri: metadata.uri,
                    name: 'recording.m4a',
                    type: 'audio/m4a'
                } as any);
            }

            formData.append('jobId', metadata.jobId);
            formData.append('meetingType', metadata.meetingType);
            formData.append('participants', JSON.stringify(metadata.participants));
            formData.append('consentGiven', String(metadata.consentGiven));
            // Dynamic Speaker Mapping (SpeakerA, SpeakerB, SpeakerC, etc.)
            metadata.participants.forEach((p, index) => {
                const letter = String.fromCharCode(65 + index); // 0->A, 1->B, 2->C...
                formData.append(`speaker${letter}`, p.name);
            });

            const uploadResponse = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // 'Content-Type': 'multipart/form-data', // Let fetch set this automatically with boundary
                }
            });

            console.log(`Upload status: ${uploadResponse.status} ${uploadResponse.statusText}`);

            if (uploadResponse.ok) {
                const responseData = await uploadResponse.json();
                console.log('Upload successful, analysis received.');

                // Assuming n8n returns { json: { summary: ..., transcript: ..., actionItems: ... } } OR directly the object
                // Adjust based on exact n8n output structure. The user's workflow shows a Code node returning { json: parsed }.
                // But the 'Respond to Webhook' usually unwraps 'json' if configured, or returns the whole item.
                // Let's safe-parse.
                let analysis = responseData.json || responseData;
                if (Array.isArray(analysis)) {
                    analysis = analysis[0];
                }

                await storageService.updateStatus(metadata.id, 'completed', analysis);
                return true;
            } else {
                const errorText = await uploadResponse.text();
                console.error('Upload failed with response:', errorText);
                await storageService.updateStatus(metadata.id, 'failed');
                return false;
            }
        } catch (error) {
            console.error('Upload error:', error);
            await storageService.updateStatus(metadata.id, 'failed');
            return false;
        }
    }

    async retryPendingUploads(): Promise<void> {
        const pending = await storageService.getPendingUploads();
        for (const meta of pending) {
            await this.uploadRecording(meta);
        }
    }
}

export const uploadService = new UploadService();
