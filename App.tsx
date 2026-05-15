import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/store/store';
import { fontAssets } from './src/theme';
import { colors } from './src/theme/colors';
import RootNavigator from './src/navigation/RootNavigator';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { setUser, clearUser } from './src/store/slices/authSlice';
import { configureAmplify, getCurrentUser } from './src/services/auth/cognito';

configureAmplify();

const queryClient = new QueryClient();

function AppContent() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(s => s.auth.isLoading);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        dispatch(setUser({ userId: user.userId, username: user.username, email: user.email }));
      } else {
        dispatch(clearUser());
      }
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
