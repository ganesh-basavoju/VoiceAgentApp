import { View, Text, TouchableOpacity, Alert, Platform, Image } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from '@/context/AuthContext';
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { theme } from "@/constants/theme";
import * as DocumentPicker from 'expo-document-picker';
import { storageService, RecordingMetadata } from '@/services/storage';
import { uploadService } from '@/services/uploader';
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleAction = (action: 'record' | 'upload') => {
    if (!user) {
        if (Platform.OS !== 'web') {
            // ToastAndroid.show("Please sign in to continue", ToastAndroid.SHORT);
             Alert.alert("Authentication Required", "Please sign in to continue");
        } else {
             alert("Please sign in to continue");
        }
        router.push('/(tabs)/profile');
        return;
    }

    if (action === 'record') {
        router.push("/record");
    } else {
        handleFileUpload();
    }
  };

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
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Removed - moved to _layout */}

      {/* Main Content - Centered Buttons */}
      <View className="flex-1 items-center justify-center px-6 pb-20">
          
          <View className="items-center mb-12">
               <Text className="text-2xl font-bold text-foreground text-center mb-3">
                   AI-Powered Field Notes & Action Item System
               </Text>
               <Text className="text-muted-foreground text-center max-w-[320px] leading-6">
                   Capturing live, in-person conversations in the field to create clean, structured, and legally defensible meeting notes.
               </Text>
          </View>

          {/* Record Button */}
          <TouchableOpacity 
            onPress={() => handleAction('record')}
            activeOpacity={0.8}
            className="items-center justify-center mb-8"
          >
              <View className="w-48 h-48 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
                  <View className="w-40 h-40 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/50">
                      <Ionicons name="mic" size={64} color="white" />
                  </View>
              </View>
              <Text className="text-foreground font-semibold text-lg mt-4">Start Recording</Text>
          </TouchableOpacity>

          {/* Upload Button */}
          <TouchableOpacity 
            onPress={() => handleAction('upload')}
            className="flex-row items-center bg-secondary px-6 py-3 rounded-full border border-border"
          >
              <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text className="text-foreground font-medium ml-2">Upload Audio File</Text>
          </TouchableOpacity>

      </View>
    </View>
  );
}
