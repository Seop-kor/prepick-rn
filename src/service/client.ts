import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
import { create as createAxios } from "axios";

import { refreshSession } from "@/graphql/mutations";

import {
  clearTokens,
  getAccessToken,
  getAccessTokenExpiresAt,
  getRefreshToken,
  setTokens,
} from "@/stores/auth";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

// Own backend only. External APIs get their own createAxios() so our token never leaks to them.
export const http = createAxios({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15 * 1000,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.skipAuth)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
};

export class GraphQLError extends Error {
  constructor(public errors: NonNullable<GraphQLResponse<unknown>["errors"]>) {
    super(errors[0].message);
  }
}

async function postGraphQL<TData, TVariables>(
  document: DocumentTypeDecoration<TData, TVariables>,
  variables: TVariables,
  options?: { skipAuth?: boolean },
): Promise<TData> {
  const { data } = await http.post<GraphQLResponse<TData>>(
    "/graphql",
    { query: document.toString(), variables },
    options,
  );
  // GraphQL returns 200 even on failure
  if (data.errors?.length) throw new GraphQLError(data.errors);
  return data.data as TData;
}

async function doRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");
  try {
    const { refreshSession: session } = await postGraphQL(
      refreshSession,
      { refreshToken },
      { skipAuth: true },
    );
    await setTokens(session);
  } catch (e) {
    // Server rejected the refresh token: log out. Network errors keep tokens for a later retry.
    if (e instanceof GraphQLError) await clearTokens();
    throw e;
  }
}

// Server rotates refresh tokens, so concurrent expired requests must share one refresh
let refreshing: Promise<void> | null = null;

function refreshTokens() {
  refreshing ??= doRefresh().finally(() => (refreshing = null));
  return refreshing;
}

// Refresh 1 minute early so requests don't race the expiry
function isAccessTokenExpiring() {
  const expiresAt = getAccessTokenExpiresAt();
  return !!expiresAt && Date.parse(expiresAt) - Date.now() < 60 * 1000;
}

export async function requestGraphQL<TData, TVariables>(
  document: DocumentTypeDecoration<TData, TVariables>,
  variables: TVariables,
  options?: { skipAuth?: boolean },
): Promise<TData> {
  if (!options?.skipAuth && isAccessTokenExpiring()) await refreshTokens();
  try {
    return await postGraphQL(document, variables, options);
  } catch (e) {
    const expired =
      e instanceof GraphQLError &&
      e.errors.some((err) => err.extensions?.code === "ACCESS_TOKEN_EXPIRED");
    if (!expired || options?.skipAuth) throw e;
    await refreshTokens();
    return postGraphQL(document, variables, options);
  }
}
