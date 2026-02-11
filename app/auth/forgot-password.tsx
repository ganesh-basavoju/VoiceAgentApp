import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth';
import { theme, Colors } from '../../constants/theme';
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
      router.push({ pathname: '/auth/reset-password', params: { email } });
    } catch (err) {
      setError('Failed to send reset link. Please check the email provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="light" />
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
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-6 border border-primary/30">
                 <Text className="text-3xl font-bold text-primary">?</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2 text-gradient">Forgot Password?</Text>
            <Text className="text-muted-foreground text-base text-center px-4">Enter your email to receive a verification code</Text>
          </View>

          <View className="w-full">
            {error ? <Text className="text-red-500 bg-red-500/10 text-center p-2 rounded-lg mb-4 overflow-hidden">{error}</Text> : null}

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
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 12 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: Colors.accent, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="email" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

            <Button
              mode="contained"
              onPress={handleResetRequest}
              loading={loading}
              disabled={loading}
              className="rounded-xl py-1 shadow-sm"
              buttonColor={Colors.primary}
              textColor={Colors.white}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
              style={{ borderRadius: 16 }}
            >
              Send Code
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
