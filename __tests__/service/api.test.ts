import { beforeEach, expect, jest, test } from '@jest/globals';

import { logout } from '@/graphql/mutations';
import { order, orders } from '@/graphql/queries';
import API from '@/service/api';
import { requestGraphQL } from '@/service/client';

jest.mock('@/service/client', () => ({ requestGraphQL: jest.fn() }));

const requestGraphQLMock = jest.mocked(requestGraphQL);

beforeEach(() => {
  requestGraphQLMock.mockReset();
});

test('주문 목록을 조회하면 cursor, size, statuses를 전달하고 주문 페이지 전체를 반환한다', async () => {
  const page = { items: [], nextCursor: 'next-cursor' };
  requestGraphQLMock.mockResolvedValue({ orders: page } as never);

  await expect(API.getOrders('cursor', 10, ['CREATED', 'READY'])).resolves.toBe(page);
  expect(requestGraphQLMock).toHaveBeenCalledWith(orders, {
    cursor: 'cursor',
    size: 10,
    statuses: ['CREATED', 'READY']
  });
});

test('주문 상세를 조회하면 id를 전달하고 조회된 주문을 반환한다', async () => {
  const foundOrder = { id: 'order-1' };
  requestGraphQLMock.mockResolvedValue({ order: foundOrder } as never);

  await expect(API.getOrder('order-1')).resolves.toBe(foundOrder);
  expect(requestGraphQLMock).toHaveBeenCalledWith(order, { id: 'order-1' });
});

test('주문 상세가 없으면 null을 반환한다', async () => {
  requestGraphQLMock.mockResolvedValue({ order: null } as never);

  await expect(API.getOrder('missing-order')).resolves.toBeNull();
});

test('로그아웃하면 refresh token과 skipAuth로 logout 뮤테이션을 요청한다', async () => {
  requestGraphQLMock.mockResolvedValue({ logout: true } as never);

  await expect(API.logout('refresh-token')).resolves.toBe(true);
  expect(requestGraphQLMock).toHaveBeenCalledWith(logout, { refreshToken: 'refresh-token' }, { skipAuth: true });
});
