import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'N1che',
  slug: 'n1che-app',
  scheme: 'n1che',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F0EDE6',
  },
  ios: {
    supportsTablet: false,
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F0EDE6',
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-font',
  ],
  extra: {
    apiBaseUrl:        process.env.API_BASE_URL,
    googleMapsApiKey:  process.env.GOOGLE_MAPS_API_KEY,
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
    cognitoClientId:   process.env.COGNITO_CLIENT_ID,
    cognitoRegion:     process.env.COGNITO_REGION,
    sentryDsn:         process.env.SENTRY_DSN,
  },
});
