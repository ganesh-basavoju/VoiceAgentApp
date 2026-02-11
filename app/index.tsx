import { View, Image, Text, Platform, TouchableOpacity, Alert } from "react-native";
import { FAB } from 'react-native-paper';
import { useRouter, Stack } from "expo-router";
import { UploadQueueList } from "../components/UploadQueueList";
import { uploadService } from '../services/uploader';
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { theme, Colors } from "../constants/theme";
import * as DocumentPicker from 'expo-document-picker';
import { storageService, RecordingMetadata } from '../services/storage';

export default function Index() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    uploadService.retryPendingUploads();
  }, []);

  const handleFileUpload = async () => {
    if (isPickerOpen) return;
    setIsPickerOpen(true);

    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['audio/*', 'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a'],
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            setIsPickerOpen(false);
            return;
        }

        const { uri, size, name } = result.assets[0];

        // Create Metadata
        const timestamp = Date.now();
        const id = timestamp.toString();
        const metadata: Omit<RecordingMetadata, 'uri' | 'uploadStatus'> = {
            id,
            durationMillis: 0, // Unknown for uploaded files initially
            timestamp,
            jobId: `UPLOAD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
            meetingType: 'Upload',
            participants: [{ role: 'Source', name: 'Uploaded File' }],
            consentGiven: true, 
        };

        // 1. Save to local storage
        const savedRecord = await storageService.saveRecording(uri, metadata);

        // 2. Trigger Upload
        // We catch errors here to ensure the UI doesn't crash, but the service handles status updates
        uploadService.uploadRecording(savedRecord).catch(err => {
            console.error("Upload trigger failed:", err);
        });

        Alert.alert("File Added", "Your audio file has been queued for processing.");

    } catch (err) {
        console.error('File selection error:', err);
        Alert.alert("Error", "Failed to select file.");
    } finally {
        setIsPickerOpen(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Section */}
      <View className="px-6 py-4 bg-background border-b border-border flex-row items-center justify-between z-10">
            <View className="flex-row items-center">
                <View className="mr-3 shadow-sm">
                    <Image 
                        source={require('../assets/images/image.png')} 
                        style={{ width: 32, height: 32, borderRadius: 8 }}
                        resizeMode="contain"
                    />
                </View>
                <View>
                    <Text className="text-xl font-bold tracking-tight text-gradient">BigLogic</Text>
                    <Text className="text-muted-foreground text-[10px] font-bold tracking-[3px] uppercase">AI Field Notes</Text>
                </View>
            </View>
            
            <TouchableOpacity onPress={signOut} className="w-9 h-9 rounded-full bg-secondary items-center justify-center border border-border">
                 <Ionicons name="log-out-outline" size={18} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        <UploadQueueList />
      </View>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-8 right-6 z-50 items-end gap-4">
        <FAB
            icon="cloud-upload"
            label="Upload File"
            color={Colors.primaryLight}
            style={{ backgroundColor: Colors.secondary, borderRadius: 30, borderWidth: 1, borderColor: Colors.border }}
            uppercase={false}
            small
            onPress={handleFileUpload}
        />
        <FAB
            icon="microphone"
            label="Record Note"
            color={Colors.white}
            style={{ backgroundColor: Colors.primary, borderRadius: 30 }}
            uppercase={false}
            onPress={() => router.push("/record")}
        />
      </View>
    </SafeAreaView>
  );
}
