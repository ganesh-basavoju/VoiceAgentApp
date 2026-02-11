import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export function TopNavbar() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="bg-background z-10">
      <StatusBar style="light" />
      <View className="px-6 py-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
                <View className="mr-3 shadow-sm">
                    <Image 
                        source={require('../assets/images/image.png')} 
                        style={{ width: 32, height: 32, borderRadius: 8 }}
                        resizeMode="contain"
                    />
                </View>
                <View>
                    <Text className="text-xl font-bold tracking-tight text-white">BigLogic</Text>
                    <Text className="text-muted-foreground text-[10px] font-bold tracking-[3px] uppercase">AI Field Notes</Text>
                </View>
            </View>
      </View>
    </SafeAreaView>
  );
}
