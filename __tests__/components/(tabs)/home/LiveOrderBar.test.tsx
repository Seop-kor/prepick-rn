import { beforeEach, expect, jest, test } from '@jest/globals';
import { router } from 'expo-router';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';

import LiveOrderBar from '@/components/(tabs)/home/LiveOrderBar';
import type { Order } from '@/graphql/queries';

jest.mock('@rneui/themed', () => ({
  Text: jest.requireActual<typeof import('react-native')>('react-native').Text
}));
jest.mock('expo-router', () => ({ router: { navigate: jest.fn(), push: jest.fn() } }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));

beforeEach(() => {
  jest.clearAllMocks();
});

function makeOrder(status: Order['status'], overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    storeId: 'store-1',
    storeName: '브루랩 강남점',
    prefixOrderNumber: 'A123',
    orderNumber: 123,
    status,
    amount: 4000,
    request: null,
    createdAt: '2026-01-01T09:00:00.000Z',
    paidAt: '2026-01-01T09:00:00.000Z',
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        productName: '아메리카노',
        skuId: 'sku-1',
        skuName: 'ICE',
        quantity: 1,
        price: 4000
      }
    ],
    ...overrides
  };
}

function renderBar(orders: Order[]): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<LiveOrderBar orders={orders} bottom={12} />);
  });
  return renderer;
}

test('생성된 주문 타입의 CREATED 주문을 받으면 해당 주문을 표시한다', () => {
  const renderer = renderBar([makeOrder('CREATED')]);
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(texts).toEqual(expect.arrayContaining(['A123', '주문을 확인하고 있어요', '브루랩 강남점']));
});

test('READY 주문이 다른 상태 주문과 함께 있으면 READY 주문을 우선 표시한다', () => {
  const renderer = renderBar([
    makeOrder('IN_PROGRESS', { id: 'order-1', prefixOrderNumber: 'A123' }),
    makeOrder('READY', {
      id: 'order-2',
      storeName: '커피하우스 역삼점',
      prefixOrderNumber: 'A118'
    })
  ]);
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(texts).toEqual(
    expect.arrayContaining(['A118', '카운터에서 받아가세요', '커피하우스 역삼점 외 1건 진행 중'])
  );
  expect(texts).not.toContain('A123');
});

test('진행 중 주문이 여러 건이면 표시 중인 주문뿐 아니라 전체 주문 수로 외 N건을 계산한다', () => {
  const renderer = renderBar([
    makeOrder('CREATED'),
    makeOrder('CONFIRMED', { id: 'order-2' }),
    makeOrder('READY', { id: 'order-3' })
  ]);
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(texts).toContain('브루랩 강남점 외 2건 진행 중');
});

test('진행 중 주문이 여러 건이면 주문 목록으로 이동한다', () => {
  const renderer = renderBar([makeOrder('CREATED'), makeOrder('READY', { id: 'order-2' })]);

  act(() => {
    renderer.root.findByProps({ accessibilityRole: 'button' }).props.onPress();
  });

  expect(router.navigate).toHaveBeenCalledWith('/orders');
  expect(router.push).not.toHaveBeenCalled();
});

test('진행 중 주문이 한 건이면 기존 방식으로 해당 주문 상세를 연다', () => {
  const renderer = renderBar([makeOrder('READY')]);

  act(() => {
    renderer.root.findByProps({ accessibilityRole: 'button' }).props.onPress();
  });

  expect(router.push).toHaveBeenCalledWith(
    { pathname: '/orders/[id]', params: { id: 'order-1' } },
    { withAnchor: true }
  );
  expect(router.navigate).not.toHaveBeenCalled();
});
