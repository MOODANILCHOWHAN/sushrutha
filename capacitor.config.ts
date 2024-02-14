import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.demo.Demoapp',
  appName: 'Demo',
  webDir: 'dist/demo',
  server: {
    androidScheme: 'https'
  }
};

export default config;
