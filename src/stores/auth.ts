import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

// Separate keys instead of zustand persist: some iOS versions reject SecureStore values over ~2048 bytes
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
const ACCESS_TOKEN_EXPIRES_AT = "accessTokenExpiresAt";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  hydrated: boolean;
};

const useAuthStore = create<AuthState>()(() => ({
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
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

export function getRefreshToken() {
  return useAuthStore.getState().refreshToken;
}

export function getAccessTokenExpiresAt() {
  return useAuthStore.getState().accessTokenExpiresAt;
}

// actions
export async function hydrateAuth() {
  try {
    const [accessToken, refreshToken, accessTokenExpiresAt] = await Promise.all(
      [
        SecureStore.getItemAsync(ACCESS_TOKEN),
        SecureStore.getItemAsync(REFRESH_TOKEN),
        SecureStore.getItemAsync(ACCESS_TOKEN_EXPIRES_AT),
      ],
    );
    useAuthStore.setState({
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      hydrated: true,
    });
  } catch {
    // Unreadable keystore (e.g. Android restored from backup): treat as logged out
    useAuthStore.setState({ hydrated: true });
  }
}

export async function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN, tokens.refreshToken),
    SecureStore.setItemAsync(
      ACCESS_TOKEN_EXPIRES_AT,
      tokens.accessTokenExpiresAt,
    ),
  ]);
  const { accessToken, refreshToken, accessTokenExpiresAt } = tokens;
  useAuthStore.setState({ accessToken, refreshToken, accessTokenExpiresAt });
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN),
    SecureStore.deleteItemAsync(REFRESH_TOKEN),
    SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRES_AT),
  ]);
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    accessTokenExpiresAt: null,
  });
}
