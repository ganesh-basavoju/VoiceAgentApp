import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.requestPasswordReset(email);
      // Navigate to Reset Password screen, passing email as param if needed
      router.push({ pathname: '/auth/reset-password', params: { email } });
    } catch (err) {
      setError('Failed to send reset link. Please check the email provided.');
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
            <View className="w-16 h-16 rounded-full bg-primary/5 items-center justify-center mb-6 border border-primary/20">
                 <Text className="text-3xl font-bold text-primary">?</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2 text-gradient">Forgot Password?</Text>
            <Text className="text-muted-foreground text-base text-center px-4">Enter your email to receive a verification code</Text>
          </View>

          <View className="w-full">
            {error ? <Text className="text-destructive bg-destructive/10 text-center p-2 rounded-lg mb-4 overflow-hidden">{error}</Text> : null}

            <View className="mb-6">
                <Text className="text-foreground font-medium mb-2">Email Address</Text>
                <TextInput
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 8 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: theme.colors.onSurfaceVariant } }} 
                left={<TextInput.Icon icon="email" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

            <Button
              mode="contained"
              onPress={handleResetRequest}
              loading={loading}
              disabled={loading}
              className="rounded-xl py-1 shadow-sm"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
            >
              Send Code
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

