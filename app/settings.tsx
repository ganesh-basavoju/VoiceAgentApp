import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

export default function SettingsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background">
             <StatusBar style="light" />
             <Stack.Screen options={{ headerShown: false }} />

             {/* Header */}
             <View className="flex-row items-center px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-secondary rounded-full border border-border">
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <Text className="text-foreground text-xl font-bold">Settings</Text>
             </View>

            <View className="p-6">
                {/* Section: Configuration */}
                <View className="mb-8">
                    <Text className="text-primary text-xs font-bold uppercase tracking-[2px] mb-4">Configuration</Text>
                    
                    <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                        <Text className="text-muted-foreground text-sm font-medium mb-2">N8N Webhook URL</Text>
                        <TextInput 
                            className="bg-input text-foreground p-3 rounded-xl border border-border mb-2"
                            placeholder="https://your-n8n-instance.com/webhook/..."
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            value="https://n8n.srv1116545.hstgr.cloud/webhook/..."
                            editable={false}
                        />
                         <Text className="text-muted-foreground text-xs italic">
                            Currently hardcoded in deployment.
                        </Text>
                    </View>
                </View>

                {/* Section: About */}
                 <View>
                    <Text className="text-primary text-xs font-bold uppercase tracking-[2px] mb-4">About</Text>
                    <View className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                         <View className="flex-row justify-between py-2 border-b border-border">
                            <Text className="text-foreground">Version</Text>
                            <Text className="text-muted-foreground">1.0.0 (Production)</Text>
                         </View>
                         <View className="flex-row justify-between pt-4">
                            <Text className="text-foreground">Build</Text>
                            <Text className="text-muted-foreground">December 2025</Text>
                         </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

