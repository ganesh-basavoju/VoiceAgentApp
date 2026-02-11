import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { audioRecorderService } from '../services/audioRecorder';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface RecordingControlsProps {
    onStop: (uri: string) => void;
}

export function RecordingControls({ onStop }: RecordingControlsProps) {
    const [durationMillis, setDurationMillis] = useState(0);

    useEffect(() => {
        const start = async () => {
            try {
                const hasPermission = await audioRecorderService.requestPermissions();
                if (hasPermission) {
                    await audioRecorderService.startRecording();
                } else {
                    alert('Permission to record audio is required.');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to start recording.');
            }
        };

        start();

        const interval = setInterval(() => {
            setDurationMillis(d => d + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleStop = async () => {
        console.log('Stop button pressed');
        try {
            const uri = await audioRecorderService.stopRecording();
            console.log('Received URI from service:', uri);
            if (uri) {
                onStop(uri);
            } else {
                console.warn('Recording URI was null');
                alert('Recording failed: No audio data found.');
            }
        } catch (err) {
            console.error('Error stopping recording', err);
            alert('Failed to stop recording.');
        }
    };

    const formatDuration = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <View className="flex-1 bg-background justify-center items-center">
            {/* Pulsing Effect Container (Static Mock) */}
            <View className="items-center mb-16">
                 <View className="w-64 h-64 rounded-full bg-accent/10 items-center justify-center border border-accent/20 shadow-lg shadow-accent/20">
                    <View className="w-56 h-56 rounded-full bg-accent/20 items-center justify-center border border-accent/30">
                        <Text className="text-6xl font-black text-foreground tracking-widest tabular-nums">
                            {formatDuration(durationMillis)}
                        </Text>
                         <View className="flex-row items-center mt-2 opacity-80">
                            <View className="w-2 h-2 rounded-full bg-destructive mr-2" />
                            <Text className="text-destructive font-bold uppercase tracking-[2px] text-xs">Recording</Text>
                         </View>
                    </View>
                 </View>
            </View>
            
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleStop}
                className="bg-destructive w-full max-w-[280px] py-4 rounded-2xl items-center shadow-md shadow-destructive/40"
            >
                <View className="flex-row items-center">
                    <Ionicons name="stop" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-3 tracking-[2px] uppercase">Stop Session</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

