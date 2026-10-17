import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

// zustand persist 대신 키를 분리: 일부 iOS는 약 2048바이트를 넘는 SecureStore 값을 거부
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const ACCESS_TOKEN_EXPIRES_AT = 'accessTokenExpiresAt';

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
  hydrated: false
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
    const [accessToken, refreshToken, accessTokenExpiresAt] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN),
      SecureStore.getItemAsync(REFRESH_TOKEN),
      SecureStore.getItemAsync(ACCESS_TOKEN_EXPIRES_AT)
    ]);
    useAuthStore.setState({
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      hydrated: true
    });
  } catch {
    // 키스토어를 읽을 수 없으면(예: 백업에서 복원된 안드로이드) 로그아웃 상태로 처리
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
    SecureStore.setItemAsync(ACCESS_TOKEN_EXPIRES_AT, tokens.accessTokenExpiresAt)
  ]);
  const { accessToken, refreshToken, accessTokenExpiresAt } = tokens;
  useAuthStore.setState({ accessToken, refreshToken, accessTokenExpiresAt });
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN),
    SecureStore.deleteItemAsync(REFRESH_TOKEN),
    SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRES_AT)
  ]);
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    accessTokenExpiresAt: null
  });
}
