import { beforeEach, expect, jest, test } from '@jest/globals';

import { logout as logoutDocument } from '@/graphql/mutations';
import { currentUser } from '@/graphql/queries';
import { requestGraphQL } from '@/service/client';
import { setTokens } from '@/stores/auth';

const mockPost = jest.fn<(url: string, body: { query: string; variables: unknown }) => Promise<unknown>>();
let mockRefreshToken: string | null = 'old-refresh';

jest.mock('axios', () => ({
  create: () => ({ post: (...args: Parameters<typeof mockPost>) => mockPost(...args), interceptors: { request: { use: jest.fn() } } })
}));
jest.mock('@/stores/auth', () => ({
  getAccessToken: () => 'access-token',
  getAccessTokenExpiresAt: () => new Date(Date.now()).toISOString(),
  getRefreshToken: () => mockRefreshToken,
  setTokens: jest.fn()
}));
jest.mock('@/stores/session', () => ({ logout: jest.fn() }));

const setTokensMock = jest.mocked(setTokens);

beforeEach(() => {
  jest.clearAllMocks();
  mockRefreshToken = 'old-refresh';
});

test('토큰 갱신 중에 로그아웃하면 갱신된 토큰을 저장하지 않고 새 세션을 서버에서 폐기한다', async () => {
  let resolveRefresh!: (value: unknown) => void;
  mockPost.mockImplementation((_url, body) => {
    if (body.query.includes('refreshSession')) return new Promise((resolve) => (resolveRefresh = resolve));
    return Promise.resolve({ data: { data: { logout: true } } });
  });

  const request = requestGraphQL(currentUser, {});
  await Promise.resolve();
  mockRefreshToken = null;
  resolveRefresh({
    data: {
      data: {
        refreshSession: { accessToken: 'new-access', refreshToken: 'new-refresh', accessTokenExpiresAt: 'later' }
      }
    }
  });

  await expect(request).rejects.toThrow();
  expect(setTokensMock).not.toHaveBeenCalled();
  expect(mockPost).toHaveBeenCalledWith(
    '/graphql',
    { query: logoutDocument.toString(), variables: { refreshToken: 'new-refresh' } },
    { skipAuth: true }
  );
});
