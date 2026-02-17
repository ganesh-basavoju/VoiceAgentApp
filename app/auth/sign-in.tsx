import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth';
import { theme, Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.signIn(email, password);
      await signIn(response.user, response.token);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
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
          <View className="items-start mb-10 w-full">
            <Text className="text-4xl font-bold text-white mb-1">BigLogic AI</Text>
            <Text className="text-gray-400 text-lg">Field Notes System</Text>
          </View>

          <View className="w-full">
            {error ? <Text className="text-red-500 bg-red-500/10 text-center p-2 rounded-lg mb-4 overflow-hidden">{error}</Text> : null}

            <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">Email Address</Text>
                <TextInput
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
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

            <View className="mb-2">
                <Text className="text-foreground font-medium mb-2">Password</Text>
                <TextInput
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                secureTextEntry
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 12 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: Colors.accent, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurfaceVariant} />}
                />
            </View>
            
            <View className="flex-row justify-end mb-6">
                 <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                    <Text className="text-accent font-medium">Forgot Password?</Text>
                 </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
              className="rounded-xl py-1 shadow-sm mb-8"
              buttonColor={Colors.primary}
              textColor={Colors.white}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
              style={{ borderRadius: 16 }}
            >
              Sign In
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground text-base">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
                <Text className="text-accent text-base font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
