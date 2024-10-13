import React from 'react';
import { Auth0Provider } from 'react-native-auth0';
import { StripeProvider } from '@stripe/stripe-react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Auth0Provider domain={"dev-jr03u2n4ktx2p1ud.us.auth0.com"} clientId={"W2lv1O8NypUE6tlpJ5S5XZLAcmwRpiTj"}>
      <StripeProvider
        publishableKey="pk_test_51Q9GX8FDMnNxWG99BVAFvcTLzqEvl2UCpifsG8rWvQvORmuWb8UAZOY6t1qep9AWxs6XFYyzUOxuYkZsATYcLMr900WqWdpAwe"
        merchantIdentifier="merchant.com.crowd"
      >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </StripeProvider>
    </Auth0Provider>
  );
}
