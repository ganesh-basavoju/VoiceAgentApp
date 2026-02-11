import { View, Text, TouchableOpacity } from 'react-native';
import { UploadQueueList } from '@/components/UploadQueueList';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FieldNotesScreen() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
                <View className="bg-card w-full p-8 rounded-3xl items-center shadow-lg border border-border">
                    <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mb-6">
                        <Ionicons name="lock-closed" size={32} color={theme.colors.primary} />
                    </View>
                    <Text className="text-xl font-bold text-foreground mb-2 text-center">Access Restricted</Text>
                    <Text className="text-muted-foreground text-center mb-8">
                        Sign in to view your field notes and recording history.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background px-6 pt-6" edges={['left', 'right']}>
            <UploadQueueList />
        </SafeAreaView>
    );
}
