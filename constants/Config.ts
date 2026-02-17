import { Platform } from 'react-native';

// ------------------------------------------------------------------
// NETWORK CONFIGURATION
// ------------------------------------------------------------------

// 1. If using Android Emulator, keep as '10.0.2.2'
// 2. If using iOS Simulator, keep as 'localhost'
// 3. If using PHYSICAL DEVICE (Phone), change this to your Computer's LAN IP.
//    Example: '192.168.1.5' (Run 'ipconfig' or 'ifconfig' on computer to find it)
// Production URL
const PRODUCTION_URL = 'https://field-notes-ai-backend.vercel.app';

export const API_BASE_URL = `${PRODUCTION_URL}/api`;
