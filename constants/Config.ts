import { Platform } from 'react-native';

// ------------------------------------------------------------------
// NETWORK CONFIGURATION
// ------------------------------------------------------------------

// 1. If using Android Emulator, keep as '10.0.2.2'
// 2. If using iOS Simulator, keep as 'localhost'
// 3. If using PHYSICAL DEVICE (Phone), change this to your Computer's LAN IP.
//    Example: '192.168.1.5' (Run 'ipconfig' or 'ifconfig' on computer to find it)
const DEV_MACHINE_IP = '192.168.31.91'; // Updated to your local IP

const PORT = 3000;

export const API_BASE_URL = Platform.select({
    android: `http://${DEV_MACHINE_IP}:${PORT}/api/auth`,
    ios: `http://localhost:${PORT}/api/auth`,
    web: `http://localhost:${PORT}/api/auth`,
    default: `http://${DEV_MACHINE_IP}:${PORT}/api/auth`,
});
