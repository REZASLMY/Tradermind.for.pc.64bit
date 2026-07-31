import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.traderos.app',
  appName: 'Trader OS',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0f1117',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f1117',
      androidSpinnerStyle: 'small',
      spinnerColor: '#c9a84c',
      showSpinner: true,
    },
  },
};

export default config;
