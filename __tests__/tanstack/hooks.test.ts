import { beforeEach, expect, jest, test } from '@jest/globals';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import API from '@/service/api';
import { useOngoingOrders, useOrder, useOrders } from '@/tanstack/hooks';
import { getOngoingOrders, getOrders } from '@/tanstack/queries';

jest.mock('@tanstack/react-query', () => ({
  skipToken: Symbol('skipToken'),
  useInfiniteQuery: jest.fn(),
  useMutation: jest.fn(),
  useQuery: jest.fn()
}));

jest.mock('@/service/api', () => ({
  __esModule: true,
  default: { getOrder: jest.fn() }
}));

jest.mock('@/tanstack/queries', () => ({
  getCurrentUser: jest.fn(),
  getOngoingOrders: jest.fn(),
  getNearbyStores: jest.fn(),
  getNewStores: jest.fn(),
  getOrders: jest.fn(),
  getPromotions: jest.fn()
}));

const useInfiniteQueryMock = jest.mocked(useInfiniteQuery);
const useQueryMock = jest.mocked(useQuery);
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
