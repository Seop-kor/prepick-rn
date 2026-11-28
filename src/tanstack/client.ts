import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
  // 오류 객체 전체를 남기면 axios config의 토큰이 로그에 찍힌다
  queryCache: new QueryCache({ onError: (error) => console.warn(error.message) }),
  mutationCache: new MutationCache({ onError: (error) => console.warn(error.message) })
});
