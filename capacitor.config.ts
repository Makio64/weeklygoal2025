import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.makio.weeklygoal',
  appName: 'Weekl yGoal',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#F6F7FF'
  }
};

export default config;
