import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { PreMeetingForm, PreMeetingData } from '../components/PreMeetingForm';
import { RecordingControls } from '../components/RecordingControls';
import { storageService } from '../services/storage';
import { uploadService } from '../services/uploader';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

export default function RecordScreen() {
    const router = useRouter();
    const [step, setStep] = useState<'setup' | 'recording'>('setup');
    const [meetingData, setMeetingData] = useState<PreMeetingData | null>(null);

    const handleSetupSubmit = (data: PreMeetingData) => {
        setMeetingData(data);
        setStep('recording');
    };

    const handleStopRecording = async (uri: string) => {
        console.log('handleStopRecording called with URI:', uri);
        if (!meetingData) {
            console.error('No meeting data found');
            return;
        }

        try {
            const metadata = {
                id: Math.random().toString(36).substring(7),
                durationMillis: 0,
                timestamp: Date.now(),
                jobId: meetingData.jobId,
                meetingType: meetingData.meetingType,
                participants: meetingData.participants,
                consentGiven: meetingData.consentGiven,
            };

            console.log('Saving recording to storage...');
            const savedRecord = await storageService.saveRecording(uri, metadata);
            console.log('Recording saved:', savedRecord.id);
            
            // Upload in background
            uploadService.uploadRecording(savedRecord)
                .then(success => console.log('Upload initiated, result:', success))
                .catch(err => console.error('Upload initiation error:', err));

            if (Platform.OS === 'web') {
                if (window.confirm("Recording saved! Click OK to return.")) {
                    router.back();
                } else {
                    router.back();
                }
            } else {
                Alert.alert("Success", "Recording saved!", [
                    { text: "OK", onPress: () => router.back() }
                ]);
            }
        } catch (error) {
            console.error('Error in handleStopRecording:', error);
            if (Platform.OS === 'web') {
                alert("Failed to save recording.");
            } else {
                Alert.alert("Error", "Failed to save recording.");
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="dark" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Custom Header for Back Navigation */}
            {step === 'setup' && (
                <View className="px-4 py-2">
                     <Appbar.BackAction onPress={router.back} color={theme.colors.onBackground} />
                </View>
            )}

            <View className="flex-1">
                {step === 'setup' ? (
                    <PreMeetingForm onSubmit={handleSetupSubmit} />
                ) : (
                    <RecordingControls onStop={handleStopRecording} />
                )}
            </View>
        </SafeAreaView>
    );
}

