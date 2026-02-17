import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from 'react';
import { authService, UserProfile } from '@/services/auth';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await authService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const data = await authService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to refresh profile:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center px-6">
                <View className="items-center mb-12">
                    <View className="w-24 h-24 bg-surface rounded-3xl items-center justify-center mb-6 shadow-lg border border-border transform rotate-3">
                         <Ionicons name="person" size={48} color={theme.colors.primary} />
                    </View>
                    <Text className="text-3xl font-bold text-foreground mb-2">My Profile</Text>
                    <Text className="text-muted-foreground text-center">
                        Sign in to manage your account and access your filed notes.
                    </Text>
                </View>

                <View className="gap-4 w-full">
                    <TouchableOpacity 
                        onPress={() => router.push('/auth/sign-in')}
                        className="w-full bg-primary h-14 rounded-full items-center justify-center shadow-lg shadow-primary/30"
                    >
                        <Text className="text-white font-bold text-lg">Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.push('/auth/sign-up')}
                        className="w-full bg-surface h-14 rounded-full items-center justify-center border border-border"
                    >
                         <Text className="text-foreground font-semibold text-lg">Create Account</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
            <ScrollView 
                className="flex-1 px-6"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                {/* Header */}
                <View className="items-center py-8">
                    <View className="w-24 h-24 bg-secondary rounded-full items-center justify-center mb-4 border-2 border-primary relative">
                        <Text className="text-3xl font-bold text-primary">
                            {profile?.user.fullName?.[0] || user.fullName?.[0] || 'U'}
                        </Text>
                        <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-background">
                             <Ionicons name="checkmark" size={16} color="white" />
                        </View>
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                        {profile?.user.fullName || user.fullName || 'User'}
                    </Text>
                    <Text className="text-muted-foreground">{profile?.user.role || 'Project Manager'}</Text>
                    <Text className="text-xs text-muted-foreground/50">{profile?.user.email || user.email}</Text>

                    {/* Stats Row */}
                    <View className="flex-row w-full justify-between mt-8 bg-surface p-6 rounded-2xl border border-border">
                        <View className="items-center flex-1 border-r border-border">
                            <Text className="text-xl font-bold text-foreground">
                                {loading ? '-' : (profile?.stats.jobsCount || 0)}
                            </Text>
                            <Text className="text-xs text-muted-foreground mt-1">Active Jobs</Text>
                        </View>
                        <View className="items-center flex-1 border-r border-border">
                            <Text className="text-xl font-bold text-foreground">
                                {loading ? '-' : (profile?.stats.notesCount || 0)}
                            </Text>
                            <Text className="text-xs text-muted-foreground mt-1">Field Notes</Text>
                        </View>
                         <View className="items-center flex-1">
                            <Text className="text-xl font-bold text-foreground">
                                {loading ? '-' : (profile?.stats.rating?.toFixed(1) || '5.0')}
                            </Text>
                            <Text className="text-xs text-muted-foreground mt-1">Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View className="mb-6">
                    <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">Account</Text>
                    <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                        <MenuItem icon="person-outline" label="Personal Information" />
                        <MenuItem icon="notifications-outline" label="Notifications" />
                        <MenuItem icon="lock-closed-outline" label="Security & Privacy" last />
                    </View>
                </View>

                 {/* Preferences Section */}
                <View className="mb-8">
                    <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">Preferences</Text>
                    <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                        <MenuItem icon="color-palette-outline" label="Appearance" value="Dark" />
                        <MenuItem icon="language-outline" label="Language" value="English" last />
                    </View>
                </View>

                <TouchableOpacity 
                    onPress={signOut}
                    className="w-full h-14 items-center justify-center mb-8 border border-red-500 rounded-2xl"
                >
                    <Text className="text-red-500 text-base font-medium">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-center text-muted-foreground/50 text-xs mb-8">
                    Version 3.0.0 (Build 2026.02)
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

function MenuItem({ icon, label, value, last }: { icon: any, label: string, value?: string, last?: boolean }) {
    return (
        <TouchableOpacity className={`flex-row items-center justify-between p-4 ${!last ? 'border-b border-border/50' : ''}`}>
            <View className="flex-row items-center gap-3">
                 <Ionicons name={icon} size={20} color={theme.colors.onSurfaceVariant} />
                 <Text className="text-foreground font-medium text-base">{label}</Text>
            </View>
            <View className="flex-row items-center gap-2">
                {value && <Text className="text-muted-foreground text-sm">{value}</Text>}
                <Ionicons name="chevron-forward" size={16} color={theme.colors.onSurfaceVariant} />
            </View>
        </TouchableOpacity>
    )
}
