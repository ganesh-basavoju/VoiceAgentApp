import { Stack } from "expo-router";
import "./global.css";
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from "../context/AuthContext";

import { theme, Colors } from "../constants/theme";

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
        <AuthProvider>
          <PaperProvider theme={theme}>
              <Stack screenOptions={{ headerShown: false }} />
          </PaperProvider>
        </AuthProvider>
    </GestureHandlerRootView>
  );
}
