import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

// Separate keys instead of zustand persist: some iOS versions reject SecureStore values over ~2048 bytes
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
};

const useAuthStore = create<AuthState>()(() => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
}));

// hooks
export function useIsLoggedIn() {
  return useAuthStore((state) => !!state.accessToken);
}

export function useIsHydrated() {
  return useAuthStore((state) => state.hydrated);
}

// getter
export function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

// actions
export async function hydrateAuth() {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN),
      SecureStore.getItemAsync(REFRESH_TOKEN),
    ]);
    useAuthStore.setState({ accessToken, refreshToken, hydrated: true });
  } catch {
    // Unreadable keystore (e.g. Android restored from backup): treat as logged out
    useAuthStore.setState({ hydrated: true });
  }
}

export async function setTokens(accessToken: string, refreshToken: string) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken),
  ]);
  useAuthStore.setState({ accessToken, refreshToken });
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN),
    SecureStore.deleteItemAsync(REFRESH_TOKEN),
  ]);
  useAuthStore.setState({ accessToken: null, refreshToken: null });
}
