import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { create as createAxios } from 'axios';

import { refreshSession } from '@/graphql/mutations';

import {
  clearTokens,
  getAccessToken,
  getAccessTokenExpiresAt,
  getRefreshToken,
  setTokens
} from '@/stores/auth';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

// 자체 백엔드 전용. 외부 API는 토큰이 새지 않도록 별도 createAxios() 사용
export const http = createAxios({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15 * 1000
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.skipAuth) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
};

export class GraphQLError extends Error {
  constructor(public errors: NonNullable<GraphQLResponse<unknown>['errors']>) {
    super(errors[0].message);
  }
}

async function postGraphQL<TData, TVariables>(
  document: DocumentTypeDecoration<TData, TVariables>,
  variables: TVariables,
  options?: { skipAuth?: boolean }
): Promise<TData> {
  const { data } = await http.post<GraphQLResponse<TData>>(
    '/graphql',
    { query: document.toString(), variables },
    options
  );
  // GraphQL은 실패해도 200을 반환
  if (data.errors?.length) throw new GraphQLError(data.errors);
  return data.data as TData;
}

async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  try {
    const { refreshSession: session } = await postGraphQL(
      refreshSession,
      { refreshToken },
      { skipAuth: true }
    );
    await setTokens(session);
  } catch (e) {
    // 서버가 refresh token을 거부하면 로그아웃. 네트워크 오류는 재시도를 위해 토큰 유지
    if (e instanceof GraphQLError) await clearTokens();
    throw e;
  }
}

// 서버가 refresh token을 교체하므로 동시에 만료된 요청은 하나의 갱신을 공유
let refreshing: Promise<void> | null = null;

function refreshTokens() {
  refreshing ??= doRefresh().finally(() => (refreshing = null));
  return refreshing;
}

// 만료 시점과 경합하지 않도록 1분 일찍 갱신
function isAccessTokenExpiring() {
  const expiresAt = getAccessTokenExpiresAt();
  return !!expiresAt && Date.parse(expiresAt) - Date.now() < 60 * 1000;
}

export async function requestGraphQL<TData, TVariables>(
  document: DocumentTypeDecoration<TData, TVariables>,
  variables: TVariables,
  options?: { skipAuth?: boolean }
): Promise<TData> {
  if (!options?.skipAuth && isAccessTokenExpiring()) await refreshTokens();
  try {
    return await postGraphQL(document, variables, options);
  } catch (e) {
    const isExpired =
      e instanceof GraphQLError && e.errors.some((err) => err.extensions?.code === 'ACCESS_TOKEN_EXPIRED');
    if (!isExpired || options?.skipAuth) throw e;
    await refreshTokens();
    return postGraphQL(document, variables, options);
  }
}
