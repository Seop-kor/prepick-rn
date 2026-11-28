import { beforeEach, expect, jest, test } from '@jest/globals';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import API from '@/service/api';
import { getRefreshToken } from '@/stores/auth';
import { logout } from '@/stores/session';
import { useLogout, useOngoingOrders, useOrder, useOrders } from '@/tanstack/hooks';
import { getOngoingOrders, getOrders } from '@/tanstack/queries';

jest.mock('@tanstack/react-query', () => ({
  skipToken: Symbol('skipToken'),
  useInfiniteQuery: jest.fn(),
  useMutation: jest.fn(),
  useQuery: jest.fn()
}));

jest.mock('@/service/api', () => ({
  __esModule: true,
  default: { getOrder: jest.fn(), logout: jest.fn() }
}));

jest.mock('@/stores/auth', () => ({ getRefreshToken: jest.fn(), setTokens: jest.fn() }));
jest.mock('@/stores/session', () => ({ logout: jest.fn() }));

jest.mock('@/tanstack/queries', () => ({
  getCurrentUser: jest.fn(),
  getOngoingOrders: jest.fn(),
  getNearbyStores: jest.fn(),
  getNewStores: jest.fn(),
  getOrders: jest.fn(),
  getPromotions: jest.fn()
}));

const useInfiniteQueryMock = jest.mocked(useInfiniteQuery);
const useMutationMock = jest.mocked(useMutation);
const useQueryMock = jest.mocked(useQuery);
const apiLogoutMock = jest.mocked(API.logout);
const getRefreshTokenMock = jest.mocked(getRefreshToken);
const localLogoutMock = jest.mocked(logout);
const getOrderMock = jest.mocked(API.getOrder);
const getOrdersMock = jest.mocked(getOrders);

beforeEach(() => {
  jest.clearAllMocks();
});

test('주문 목록에서 다음 cursor를 받으면 해당 cursor로 이어서 조회하고 null이면 멈춘다', async () => {
  const page = { items: [{ id: 'order-1' }], nextCursor: 'cursor-2' };
  const queryResult = { data: { pages: [page] } };
  getOrdersMock.mockResolvedValue(page as never);
  useInfiniteQueryMock.mockReturnValue(queryResult as never);

  expect(useOrders()).toBe(queryResult);

  const options = useInfiniteQueryMock.mock.calls[0][0];
  expect(options.queryKey).toEqual(['orders']);
  expect(options.initialPageParam).toBeNull();
  const queryFn = options.queryFn as (context: { pageParam: string | null }) => Promise<unknown>;
  await expect(queryFn({ pageParam: 'cursor-1' })).resolves.toBe(page);
  expect(getOrdersMock).toHaveBeenCalledWith('cursor-1');
  const getNextPageParam = options.getNextPageParam as (lastPage: { nextCursor: string | null }) => string | null;
  expect(getNextPageParam(page)).toBe('cursor-2');
  expect(getNextPageParam({ nextCursor: null })).toBeNull();
});

test('홈의 진행 중 주문을 조회하면 일반 목록과 구분되는 query key를 사용한다', () => {
  const queryResult = { data: [{ id: 'order-1' }] };
  useQueryMock.mockReturnValue(queryResult as never);

  expect(useOngoingOrders()).toBe(queryResult);

  const options = useQueryMock.mock.calls[0][0];
  expect(options.queryKey).toEqual(['ongoingOrders']);
  expect(options.queryKey).not.toEqual(['orders']);
  expect(options.queryFn).toBe(getOngoingOrders);
});

test('주문 상세를 조회하면 id를 query key와 API 요청에 사용한다', async () => {
  const order = { id: 'order-1' };
  const queryResult = { data: order };
  getOrderMock.mockResolvedValue(order as never);
  useQueryMock.mockReturnValue(queryResult as never);

  await expect(useOrder('order-1')).toBe(queryResult);

  const options = useQueryMock.mock.calls[0][0];
  expect(options.queryKey).toEqual(['order', 'order-1']);
  const queryFn = options.queryFn as () => Promise<unknown>;
  await expect(queryFn()).resolves.toBe(order);
  expect(getOrderMock).toHaveBeenCalledWith('order-1');
});

function getLogoutMutationFn() {
  useLogout();
  return useMutationMock.mock.calls[0][0].mutationFn as () => Promise<unknown>;
}

test('로그아웃하면 지우기 전의 refresh token으로 서버 로그아웃을 요청하고 로컬 로그아웃을 실행한다', async () => {
  let refreshToken: string | null = 'refresh-token';
  getRefreshTokenMock.mockImplementation(() => refreshToken);
  localLogoutMock.mockImplementation(async () => {
    refreshToken = null;
  });
  apiLogoutMock.mockResolvedValue(true);

  await getLogoutMutationFn()();

  expect(apiLogoutMock).toHaveBeenCalledWith('refresh-token');
  expect(localLogoutMock).toHaveBeenCalledTimes(1);
});

test('서버 로그아웃 응답이 끝나지 않아도 로컬 로그아웃이 끝난다', async () => {
  getRefreshTokenMock.mockReturnValue('refresh-token');
  localLogoutMock.mockResolvedValue();
  apiLogoutMock.mockReturnValue(new Promise(() => {}));

  await getLogoutMutationFn()();

  expect(localLogoutMock).toHaveBeenCalledTimes(1);
});

test('서버 로그아웃 요청이 실패해도 로그아웃은 오류 없이 끝난다', async () => {
  getRefreshTokenMock.mockReturnValue('refresh-token');
  localLogoutMock.mockResolvedValue();
  apiLogoutMock.mockRejectedValue(new Error('network'));

  await expect(getLogoutMutationFn()()).resolves.toBeUndefined();
  await Promise.resolve();
  expect(localLogoutMock).toHaveBeenCalledTimes(1);
});

test('refresh token이 없으면 서버 요청 없이 로컬 로그아웃만 한다', async () => {
  getRefreshTokenMock.mockReturnValue(null);
  localLogoutMock.mockResolvedValue();

  await getLogoutMutationFn()();

  expect(apiLogoutMock).not.toHaveBeenCalled();
  expect(localLogoutMock).toHaveBeenCalledTimes(1);
});
