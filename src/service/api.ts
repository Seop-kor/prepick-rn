import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
import { create as createAxios } from "axios";

import { healthCheck } from "@/graphql/queries";

import { getAccessToken } from "@/stores/auth";

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

// ponytail: no token refresh yet. Add a response interceptor once the server's refresh API and
// unauthenticated error shape (HTTP 401 vs errors[].extensions.code) are known.

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
};

export class GraphQLError extends Error {
  constructor(public errors: NonNullable<GraphQLResponse<unknown>["errors"]>) {
    super(errors[0].message);
  }
}

export async function requestGraphQL<TData, TVariables>(
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

class API {
  // GraphQL:  sendOtp(phone: string) { return requestGraphQL(SendOtp, { phone }).then((r) => r.sendOtp); }
  // Public:   requestGraphQL(Document, variables, { skipAuth: true })
  // REST:     http.post('/upload', form).then((r) => r.data)
  healthCheck() {
    return requestGraphQL(healthCheck, {}, { skipAuth: true }).then(
      (res) => res.healthCheck,
    );
  }
}

const instance = new API();
export default instance;
