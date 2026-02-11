import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { TopNavbar } from '@/components/TopNavbar';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -5,
          marginBottom: 5,
        },
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: Colors.surface,
            borderTopWidth: 1,
            borderTopColor: '#333333',
            height: 90,
            paddingTop: 10,
          },
          default: {
            backgroundColor: Colors.surface,
            borderTopWidth: 1,
            borderTopColor: '#333333',
            height: 80,
            paddingTop: 10,
            paddingBottom: 10,
            elevation: 0,
            shadowOpacity: 0,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
                size={28} 
                name={focused ? "house.fill" : "house"} 
                color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="field-notes"
        options={{
          title: 'Field Notes',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
                size={28} 
                name={focused ? "list.bullet.clipboard.fill" : "list.bullet.clipboard"} 
                color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
                size={28} 
                name={focused ? "person.fill" : "person"} 
                color={color} 
            />
          ),
        }}
      />
      </Tabs>
    </View>
  );
}
