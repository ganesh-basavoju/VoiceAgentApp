# BigLogicAI Field Notes App

## Overview
This is an Expo React Native app with web support. It features authentication (sign-in, sign-up, forgot password, reset password), field notes recording, and a tab-based navigation system.

## Project Architecture
- **Framework**: Expo SDK 54 with React Native 0.81.5
- **Routing**: expo-router with file-based routing
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: React Context
- **Navigation**: React Navigation with bottom tabs

## Directory Structure
```
app/                  # Main application routes (file-based routing)
├── auth/            # Authentication screens (sign-in, sign-up, password reset)
├── (tabs)/          # Tab-based navigation screens
├── recording/       # Recording-related screens
├── _layout.tsx      # Root layout
├── index.tsx        # Home screen
└── global.css       # Global styles
components/          # Reusable UI components
constants/           # App constants
context/             # React Context providers
hooks/               # Custom React hooks
services/            # API/business logic services
assets/              # Images, fonts, and other static assets
scripts/             # Utility scripts
dist/                # Web build output (generated)
```

## Development Commands
- `npm run serve` - Serve the web build on port 5000
- `npm run build:web` - Export/build for web platform
- `npm run dev` - Build and serve web version
- `npm run web` - Start Expo dev server for web
- `npm run start` - Start Expo dev server
- `npm run lint` - Run ESLint

## Deployment
The app is configured for static web deployment. The `dist/` folder contains the production build.
- Build command: `npm run build:web`
- Serve static files from: `dist/`

## Recent Changes
- 2026-02-03: Initial Replit environment setup, configured for web on port 5000
