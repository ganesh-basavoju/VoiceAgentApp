
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { audioRecorderService } from '../services/audioRecorder';
import { Ionicons } from '@expo/vector-icons';
import { theme, Colors } from '../constants/theme';

interface RecordingControlsProps {
    onStop: (uri: string) => void;
}

export function RecordingControls({ onStop }: RecordingControlsProps) {
    const [durationMillis, setDurationMillis] = useState(0);
    const pulseAnim = useRef(new Animated.Value(1)).current;

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

        // Pulse Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

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
            
            {/* Timer & Animation Section */}
            <View className="items-center mb-20">
                 {/* Pulsing Circles */}
                 <View className="items-center justify-center relative">
                    <Animated.View 
                        style={{
                            transform: [{ scale: pulseAnim }],
                            opacity: 0.2,
                        }}
                        className="absolute w-72 h-72 rounded-full bg-primary"
                    />
                    <Animated.View 
                        style={{
                            transform: [{ scale: pulseAnim }],
                            opacity: 0.4,
                        }}
                        className="absolute w-60 h-60 rounded-full bg-primary"
                    />
                    
                    {/* Main Circle */}
                    <View className="w-52 h-52 rounded-full bg-surface border-4 border-primary items-center justify-center shadow-2xl shadow-primary/50">
                        <Text className="text-5xl font-black text-foreground tracking-widest tabular-nums font-mono">
                            {formatDuration(durationMillis)}
                        </Text>
                         <View className="flex-row items-center mt-3 bg-destructive/10 px-3 py-1 rounded-full">
                            <View className="w-2 h-2 rounded-full bg-destructive mr-2 animate-pulse" />
                            <Text className="text-destructive font-bold uppercase tracking-[2px] text-[10px]">Recording</Text>
                         </View>
                    </View>
                 </View>
            </View>
            
            {/* Stop Button */}
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleStop}
                className="bg-destructive w-full max-w-[280px] py-5 rounded-2xl items-center shadow-lg shadow-destructive/40 border border-red-400"
            >
                <View className="flex-row items-center">
                    <View className="bg-white/20 p-2 rounded-lg mr-3">
                        <Ionicons name="stop" size={24} color="white" />
                    </View>
                    <Text className="text-white font-bold text-xl tracking-[2px] uppercase">Stop Session</Text>
                </View>
            </TouchableOpacity>

            <Text className="text-muted-foreground text-xs mt-6 opacity-60">
                Tap to stop and save recording
            </Text>
        </View>
    );
}

