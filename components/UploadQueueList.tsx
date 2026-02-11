import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { RecordingMetadata, storageService } from '../services/storage';
import { uploadService } from '../services/uploader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, Colors } from '../constants/theme';

    import { useFocusEffect } from 'expo-router';
    import { useCallback } from 'react';

    export function UploadQueueList() {
    const router = useRouter();
    const [recordings, setRecordings] = useState<RecordingMetadata[]>([]);

    const loadRecordings = async () => {
        try {
            const data = await storageService.getAllMetadata();
            setRecordings(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (error) {
            console.error("Failed to load recordings", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadRecordings();
        }, [])
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return 'checkmark-circle';
            case 'uploading': return 'cloud-upload';
            case 'failed': return 'alert-circle';
            default: return 'time';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'hsl(142, 70%, 45%)'; // Success
            case 'uploading': return Colors.accent; // Accent purple
            case 'failed': return 'hsl(0, 84%, 60%)'; // Destructive
            default: return theme.colors.onSurfaceVariant; // Muted Foreground
        }
    };

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4 pl-2">
                <Text className="text-foreground text-lg font-semibold">Recent Recordings</Text>
                <TouchableOpacity onPress={loadRecordings}>
                    <Text className="text-primary text-sm font-medium">Refresh</Text>
                </TouchableOpacity>
            </View>
            
            {recordings.length === 0 ? (
                <View className="flex-1 items-center justify-center mt-20 opacity-50">
                    <Ionicons name="recording-outline" size={48} color={theme.colors.onSurfaceVariant} />
                    <Text className="text-muted-foreground mt-4 text-center leading-6">No recordings yet.{'\n'}Start a meeting to capture notes.</Text>
                </View>
            ) : (
                <FlatList
                    data={recordings}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            activeOpacity={0.9}
                            onPress={() => router.push(`/recording/${item.id}`)}
                        >
                            <View className="bg-card rounded-2xl mb-3 p-4 border border-border shadow-sm">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 pr-4">
                                        <View className="flex-row items-center mb-2">
                                            <View className="bg-secondary rounded border border-border px-2 py-0.5 mr-2">
                                                <Text className="text-primary text-[10px] font-bold uppercase tracking-wide">
                                                    {item.meetingType}
                                                </Text>
                                            </View>
                                            <Text className="text-muted-foreground text-xs">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <Text className="text-card-foreground text-base font-semibold mb-1">
                                            {item.jobId} {item.participants[0]?.name ? `with ${item.participants[0].name}` : ''}
                                        </Text>
                                        <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                                            Participants: {item.participants.map(p => p.name).join(', ')}
                                        </Text>
                                    </View>
                                    
                                    <View className="items-end justify-center pl-2">
                                         {item.uploadStatus === 'uploading' ? (
                                            <ActivityIndicator size={20} color={getStatusColor(item.uploadStatus)} className="m-2" />
                                         ) : (
                                            <Ionicons 
                                                name={getStatusIcon(item.uploadStatus) as any} 
                                                size={24} 
                                                color={getStatusColor(item.uploadStatus)} 
                                            />
                                         )}
                                         
                                         {item.uploadStatus === 'failed' && (
                                             <TouchableOpacity 
                                                onPress={() => uploadService.uploadRecording(item)}
                                                className="mt-2 bg-secondary px-3 py-1 rounded-xl"
                                             >
                                                 <Text className="text-primary text-xs">Retry</Text>
                                             </TouchableOpacity>
                                         )}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

