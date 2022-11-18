import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'test-native',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Badge: {
      persist: true,
      autoClear: true,
    }
  }
};

export default config;
