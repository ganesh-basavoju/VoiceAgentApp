import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth';
import { theme, Colors } from '../../constants/theme';

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.signUp(fullName, email, password);
      router.replace('/auth/sign-in');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
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
          <View className="items-center mb-10">
            <View className="shadow-sm mb-6">
                 <Image 
                    source={require('../../assets/images/BigLogic AI Logo Design.png')} 
                    style={{ width: 64, height: 64, borderRadius: 16 }}
                    resizeMode="contain"
                 />
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2 text-gradient">Create Account</Text>
            <Text className="text-muted-foreground text-base text-center">Join us and start capturing your field notes</Text>
          </View>

          <View className="w-full">
            {error ? <Text className="text-red-500 bg-red-500/10 text-center p-2 rounded-lg mb-4 overflow-hidden">{error}</Text> : null}

            <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">Full Name</Text>
                <TextInput
                mode="outlined"
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 12 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: Colors.accent, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="account" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

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

            <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">Password</Text>
                <TextInput
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
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

             <View className="mb-5">
                <Text className="text-foreground font-medium mb-2">Confirm Password</Text>
                <TextInput
                mode="outlined"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                secureTextEntry
                className="bg-input"
                style={{ backgroundColor: theme.colors.elevation.level1 }}
                outlineStyle={{ borderColor: theme.colors.outline, borderRadius: 12 }}
                textColor={theme.colors.onSurface}
                theme={{ colors: { primary: Colors.accent, onSurfaceVariant: theme.colors.onSurfaceVariant } }}
                left={<TextInput.Icon icon="lock-check" color={theme.colors.onSurfaceVariant} />}
                />
            </View>

            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              className="rounded-xl py-1 shadow-sm mt-4 mb-8"
              buttonColor={Colors.primary}
              textColor={Colors.white}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
              style={{ borderRadius: 16 }}
            >
              Sign Up
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                <Text className="text-accent text-base font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
