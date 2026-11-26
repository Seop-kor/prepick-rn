import { beforeEach, expect, jest, test } from '@jest/globals';

import API from '@/service/api';
import { getOngoingOrders, getOrders } from '@/tanstack/queries';

jest.mock('@/service/api', () => ({
  __esModule: true,
  default: { getOrders: jest.fn() }
}));

const getOrdersMock = jest.mocked(API.getOrders);
const ONGOING_STATUSES = ['CREATED', 'CONFIRMED', 'IN_PROGRESS', 'READY'];

beforeEach(() => {
  getOrdersMock.mockReset();
});

test('주문 목록을 조회하면 API에 cursor와 페이지 크기 10을 전달하고 응답을 반환한다', async () => {
  const page = { items: [{ id: 'order-1' }], nextCursor: 'cursor-2' };
  getOrdersMock.mockResolvedValue(page as never);

  await expect(getOrders('cursor-1')).resolves.toBe(page);
  expect(getOrdersMock).toHaveBeenCalledWith('cursor-1', 10);
});

test('홈의 진행 중 주문이 여러 페이지이면 모든 페이지를 순차 조회해 순서대로 합친다', async () => {
  const firstOrder = { id: 'order-1' };
  const secondOrder = { id: 'order-2' };
  const thirdOrder = { id: 'order-3' };
  getOrdersMock
    .mockResolvedValueOnce({ items: [firstOrder], nextCursor: 'cursor-2' } as never)
    .mockResolvedValueOnce({ items: [secondOrder], nextCursor: 'cursor-3' } as never)
    .mockResolvedValueOnce({ items: [thirdOrder], nextCursor: null } as never);

  await expect(getOngoingOrders()).resolves.toEqual([firstOrder, secondOrder, thirdOrder]);
  expect(getOrdersMock).toHaveBeenCalledTimes(3);
  expect(getOrdersMock).toHaveBeenNthCalledWith(1, null, 10, ONGOING_STATUSES);
  expect(getOrdersMock).toHaveBeenNthCalledWith(2, 'cursor-2', 10, ONGOING_STATUSES);
  expect(getOrdersMock).toHaveBeenNthCalledWith(3, 'cursor-3', 10, ONGOING_STATUSES);
});
