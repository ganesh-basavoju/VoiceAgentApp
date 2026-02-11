import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const Colors = {
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    primaryDark: '#6D28D9',
    accent: '#A855F7',
    accentGlow: '#9333EA',
    secondary: '#2D2640',
    secondaryLight: '#3D3555',
    lavender: '#C4B5FD',
    background: '#1E1B2E',
    backgroundLight: '#2A2540',
    surface: '#252040',
    surfaceLight: '#302A4A',
    text: '#F0ECF9',
    textSecondary: '#9B8FC4',
    textMuted: '#6B5E8A',
    border: '#3D3560',
    inputBg: '#2A2445',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    white: '#FFFFFF',
};

export const Fonts = {
    rounded: 'System',
    mono: 'monospace',
};

export const theme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.primary,
        onPrimary: Colors.white,
        primaryContainer: Colors.primaryDark,
        onPrimaryContainer: Colors.white,

        secondary: Colors.secondary,
        onSecondary: Colors.text,
        secondaryContainer: Colors.secondaryLight,
        onSecondaryContainer: Colors.text,

        background: Colors.background,
        onBackground: Colors.text,

        surface: Colors.surface,
        onSurface: Colors.text,
        surfaceVariant: Colors.surfaceLight,
        onSurfaceVariant: Colors.textSecondary,

        error: Colors.error,
        onError: Colors.white,

        outline: Colors.border,
        outlineVariant: Colors.secondary,

        elevation: {
            ...DefaultTheme.colors.elevation,
            level0: Colors.background,
            level1: Colors.surface,
            level2: Colors.surfaceLight,
            level3: Colors.secondaryLight,
        },
    },
};
