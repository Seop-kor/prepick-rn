import { expect, test } from '@jest/globals';

import { isLiveOrder, isVoidOrder, ORDER_STATUS } from '@/components/(tabs)/orders/status';
import type { Order } from '@/graphql/queries';

test('CREATED 주문이면 확인 중 문구와 첫 진행 단계를 표시한다', () => {
  const order = { status: 'CREATED' } as Order;

  expect(ORDER_STATUS.CREATED).toMatchObject({
    label: '주문 확인 중',
    message: '주문을 확인하고 있어요',
    step: 0
  });
  expect(isLiveOrder(order)).toBe(true);
  expect(isVoidOrder(order)).toBe(false);
});

test('IN_PROGRESS 주문이면 메뉴 준비 문구와 세 번째 진행 단계를 표시한다', () => {
  const order = { status: 'IN_PROGRESS' } as Order;

  expect(ORDER_STATUS.IN_PROGRESS).toMatchObject({
    label: '메뉴 준비 중',
    message: '메뉴를 만들고 있어요',
    step: 2
  });
  expect(isLiveOrder(order)).toBe(true);
  expect(isVoidOrder(order)).toBe(false);
});

test('READY 주문이면 목록은 준비 완료로 표시하고 상세 안내와 마지막 진행 단계를 유지한다', () => {
  const order = { status: 'READY' } as Order;

  expect(ORDER_STATUS.READY).toMatchObject({
    label: '준비 완료',
    message: '카운터에서 받아가세요',
    step: 3
  });
  expect(isLiveOrder(order)).toBe(true);
  expect(isVoidOrder(order)).toBe(false);
});

test('PICKED_UP 주문이면 목록은 수령 완료로 표시하고 상세 안내를 유지한 채 종료 상태로 판정한다', () => {
  const order = { status: 'PICKED_UP' } as Order;

  expect(ORDER_STATUS.PICKED_UP).toMatchObject({
    label: '수령 완료',
    message: '픽업을 완료했어요',
    step: null
  });
  expect(isLiveOrder(order)).toBe(false);
  expect(isVoidOrder(order)).toBe(false);
});

test('CANCELED 주문이면 취소와 거절을 통합한 문구와 금액 취소선을 적용하고 종료 상태로 판정한다', () => {
  const order = { status: 'CANCELED' } as Order;

  expect(ORDER_STATUS.CANCELED).toMatchObject({
    label: '주문 취소',
    message: '주문이 취소됐어요',
    step: null
  });
  expect(isLiveOrder(order)).toBe(false);
  expect(isVoidOrder(order)).toBe(true);
  expect(ORDER_STATUS).not.toHaveProperty('REJECTED');
});

test('CONFIRMED 주문이면 접수 문구와 두 번째 진행 단계를 표시한다', () => {
  const order = { status: 'CONFIRMED' } as Order;

  expect(ORDER_STATUS.CONFIRMED).toMatchObject({
    label: '주문 접수',
    message: '주문이 접수됐어요',
    step: 1
  });
  expect(isLiveOrder(order)).toBe(true);
  expect(isVoidOrder(order)).toBe(false);
});
