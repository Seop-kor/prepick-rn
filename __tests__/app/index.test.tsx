import { beforeEach, expect, jest, test } from '@jest/globals';
import * as SplashScreen from 'expo-splash-screen';
import { act, create } from 'react-test-renderer';

import IndexScreen from '@/app/index';
import API from '@/service/api';
import { getAccessToken, hydrateAuth } from '@/stores/auth';
import { queryClient } from '@/tanstack/client';

jest.mock('expo-router', () => ({ Redirect: () => null }));
jest.mock('expo-splash-screen', () => ({ hide: jest.fn() }));
jest.mock('@/service/api', () => ({ __esModule: true, default: { currentUser: jest.fn() } }));
jest.mock('@/stores/auth', () => ({
  getAccessToken: jest.fn(),
  hydrateAuth: jest.fn(),
  useIsHydrated: () => false,
  useIsLoggedIn: () => false
}));
jest.mock('@/stores/location', () => ({ initLocation: jest.fn() }));

const currentUserMock = jest.mocked(API.currentUser);
const getAccessTokenMock = jest.mocked(getAccessToken);
const hydrateAuthMock = jest.mocked(hydrateAuth);
const hideSplashMock = jest.mocked(SplashScreen.hide);

const user = { id: 'u1', name: '홍길동', phone: '01012345678', createdAt: '2026-01-01T00:00:00.000Z' };

beforeEach(() => {
  jest.clearAllMocks();
  queryClient.clear();
  hydrateAuthMock.mockResolvedValue();
});

async function renderScreen() {
  await act(async () => {
    create(<IndexScreen />);
  });
}

test('로그인 상태로 진입하면 currentUser를 받아온 뒤 스플래시를 숨기고 이름을 캐시에 둔다', async () => {
  getAccessTokenMock.mockReturnValue('access-token');
  currentUserMock.mockResolvedValue(user as never);

  await renderScreen();

  expect(hideSplashMock).toHaveBeenCalledTimes(1);
  expect(queryClient.getQueryData<typeof user>(['currentUser'])?.name).toBe('홍길동');
});

test('currentUser 응답이 끝나기 전에는 스플래시를 숨기지 않는다', async () => {
  getAccessTokenMock.mockReturnValue('access-token');
  let resolveUser!: (value: typeof user) => void;
  currentUserMock.mockReturnValue(new Promise((resolve) => (resolveUser = resolve)) as never);

  await renderScreen();
  expect(hideSplashMock).not.toHaveBeenCalled();

  await act(async () => {
    resolveUser(user);
  });
  expect(hideSplashMock).toHaveBeenCalledTimes(1);
});

test('currentUser 조회가 실패해도 스플래시를 숨긴다', async () => {
  getAccessTokenMock.mockReturnValue('access-token');
  currentUserMock.mockRejectedValue(new Error('network'));
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  await renderScreen();

  expect(hideSplashMock).toHaveBeenCalledTimes(1);
});

test('로그아웃 상태로 진입하면 currentUser를 요청하지 않고 스플래시를 숨긴다', async () => {
  getAccessTokenMock.mockReturnValue(null);

  await renderScreen();

  expect(currentUserMock).not.toHaveBeenCalled();
  expect(hideSplashMock).toHaveBeenCalledTimes(1);
});
