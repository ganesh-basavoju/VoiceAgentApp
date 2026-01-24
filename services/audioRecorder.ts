import { Audio } from 'expo-av';

export class AudioRecorderService {
    private recording: Audio.Recording | null = null;
    /**
     * Request permissions to record audio
     */
    async requestPermissions(): Promise<boolean> {
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
    }

    /**
     * Start recording audio
     */
    async startRecording(): Promise<void> {
        try {
            console.log('Requesting permissions...');
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording...');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            this.recording = recording;
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            throw err;
        }
    }

    /**
     * Stop recording and return the URI of the recorded file
     */
    async stopRecording(): Promise<string | null> {
        console.log('Stopping recording...');
        if (!this.recording) {
            console.warn('No active recording found');
            return null;
        }

        try {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            console.log('Recording stopped, URI:', uri);
            this.recording = null;
            return uri;
        } catch (error) {
            console.error('Error stopping recording:', error);
            // Attempt to return existing URI if available even if stop failed
            const uri = this.recording.getURI();
            this.recording = null;
            return uri;
        }
    }

    /**
     * Get current recording duration in milliseconds
     * Note: This is only accurate if called while recording or immediately after stop
     */
    async getStatus(): Promise<Audio.RecordingStatus | null> {
        if (this.recording) {
            return this.recording.getStatusAsync();
        }
        return null;
    }
}

export const audioRecorderService = new AudioRecorderService();
