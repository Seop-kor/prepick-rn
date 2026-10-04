import { ThemeProvider } from "@rneui/themed";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useIsLoggedIn } from "@/stores/auth";
import { theme } from "@/theme";

// Hidden by index.tsx once init is done
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => console.warn(error) }),
  mutationCache: new MutationCache({ onError: (error) => console.warn(error) }),
});

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
