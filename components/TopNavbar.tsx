import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export function TopNavbar() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="bg-background z-10">
      <StatusBar style="light" />
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/10">
            <View className="flex-row items-center">
                <View className="mr-5 shadow-sm">
                    <Image 
                        source={require('../assets/images/image.png')} 
                        style={{ width: 40, height: 40, borderRadius: 8 }}
                        resizeMode="contain"
                    />
                </View>
                <View>
                    <Text className="text-2xl font-bold tracking-tight text-white">BigLogic</Text>
                    <Text className="text-muted-foreground text-xs font-bold tracking-[3px] uppercase">AI Field Notes</Text>
                </View>
            </View>
      </View>
    </SafeAreaView>
  );
}
