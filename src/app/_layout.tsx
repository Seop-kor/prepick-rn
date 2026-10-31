import { ThemeProvider } from '@rneui/themed';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useIsLoggedIn } from '@/stores/auth';
import { queryClient } from '@/tanstack/client';
import { theme } from '@/theme';

// 초기화가 끝나면 index.tsx에서 숨김
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
