import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        // "Luxury White + Black" Theme
        primary: 'hsl(0, 0%, 0%)',       // Strong Black
        onPrimary: 'hsl(0, 0%, 100%)',   // White text on black
        primaryContainer: 'hsl(0, 0%, 20%)', // Using hover/dark gray for container if needed, or stick to standards
        onPrimaryContainer: 'hsl(0, 0%, 100%)',

        secondary: 'hsl(0, 0%, 96%)',    // Subtle Gray
        onSecondary: 'hsl(0, 0%, 0%)',   // Black text
        secondaryContainer: 'hsl(0, 0%, 90%)',
        onSecondaryContainer: 'hsl(0, 0%, 0%)',

        background: 'hsl(0, 0%, 100%)',  // Plain White
        onBackground: 'hsl(0, 0%, 0%)',  // Pure Black

        surface: 'hsl(0, 0%, 100%)',     // Cards are white
        onSurface: 'hsl(0, 0%, 0%)',     // Card text is black
        surfaceVariant: 'hsl(0, 0%, 96%)', // Muted/Subtle backgrounds
        onSurfaceVariant: 'hsl(0, 0%, 45%)', // Muted foreground

        error: 'hsl(0, 84%, 60%)',       // Destructive
        onError: 'hsl(0, 0%, 100%)',

        outline: 'hsl(0, 0%, 92%)',      // Border color
        outlineVariant: 'hsl(0, 0%, 96%)',
    },
};
