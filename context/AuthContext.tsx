
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AuthContext = createContext<any>(null);

// Web fallback for SecureStore
const setStorage = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const getStorage = async (key: string) => {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

const removeStorage = async (key: string) => {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getStorage('token');
        const userData = await getStorage('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    // We no longer strictly redirect based on segments here.
    // Navigation is now handled by the individual screens (e.g. Profile tab for auth).
    
    // However, if we're in the (tabs) group and not logged in, we might want to ensure
    // we don't show protected data. But the requirement is to allow seeing the tabs.
    // So we just let the router do its thing.
  }, [user, segments, isLoading]);

  const signIn = async (userData: any, token: string) => {
      setUser(userData);
      await setStorage('token', token);
      await setStorage('user', JSON.stringify(userData));
  };

  const signOut = async () => {
      setUser(null);
      await removeStorage('token');
      await removeStorage('user');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
