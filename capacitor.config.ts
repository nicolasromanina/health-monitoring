
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dc44c8da68b34df4988fae21b2afee1b',
  appName: 'VitalSync',
  webDir: 'dist',
  server: {
    url: 'https://dc44c8da-68b3-4df4-988f-ae21b2afee1b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0EA5E9",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#FFFFFF",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
