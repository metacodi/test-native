import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'test.metacodi.com',
  appName: 'test-native',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
