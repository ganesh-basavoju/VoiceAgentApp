import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.verifyOtp(email, otp);
      await authService.updatePassword(email, newPassword, otp);
      
      // Navigate to Sign In after successful reset
      router.replace('/auth/sign-in');
      // Ideally show a success toast or alert here, but simple navigation works for now
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-6 left-6 z-10 p-2 bg-secondary rounded-full border border-border"
          >
             <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>

          <View className="items-center mb-10 mt-10">
            <View className="w-16 h-16 rounded-full bg-success/10 items-center justify-center mb-6 border border-success/20">
                 <Text className="text-3xl font-bold text-success">✓</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2 text-gradient">Reset Password</Text>
            <Text className="text-muted-foreground text-base text-center px-4">Enter the code sent to {email} and your new password</Text>
          </View>

          <View className="w-full">
            {error ? <Text className="text-destructive bg-destructive/10 text-center p-2 rounded-lg mb-4 overflow-hidden">{error}</Text> : null}

            <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">Verification Code (OTP)</Text>
                <TextInput
                mode="outlined"
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                keyboardType="number-pad"
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 8 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="shield-check" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

            <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">New Password</Text>
                <TextInput
                mode="outlined"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                secureTextEntry
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 8 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

            <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">Confirm New Password</Text>
                <TextInput
                mode="outlined"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                secureTextEntry
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 8 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="lock-check" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

            <Button
              mode="contained"
              onPress={handleUpdatePassword}
              loading={loading}
              disabled={loading}
              className="rounded-xl py-1 shadow-sm mt-4"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
            >
              Update Password
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

