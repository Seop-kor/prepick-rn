import { expect, jest, test } from '@jest/globals';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';

import OrderRow from '@/components/(tabs)/orders/OrderRow';
import type { Order } from '@/graphql/queries';

jest.mock('@rneui/themed', () => ({
  Text: jest.requireActual<typeof import('react-native')>('react-native').Text
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

const ORDER: Order = {
  id: 'order-1',
  storeId: 'store-1',
  storeName: '브루랩 강남점',
  prefixOrderNumber: 'A123',
  orderNumber: 123,
  status: 'READY',
  amount: 8500,
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
    },
    {
      id: 'item-2',
      productId: 'product-2',
      productName: '카페라떼',
      skuId: 'sku-2',
      skuName: 'HOT',
      quantity: 1,
      price: 4500
    }
  ]
};

function renderOrder(order: Order): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<OrderRow order={order} />);
  });
  return renderer;
}

test('실제 주문을 받으면 매장·메뉴·금액·상태를 표시한다', () => {
  const renderer = renderOrder(ORDER);
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(texts).toEqual(
    expect.arrayContaining(['브루랩 강남점', '아메리카노 외 1개', '8,500원', '준비 완료'])
  );
});

test.each<[Order['status'], string]>([
  ['CREATED', '주문 확인 중'],
  ['CONFIRMED', '주문 접수'],
  ['IN_PROGRESS', '메뉴 준비 중'],
  ['READY', '준비 완료'],
  ['PICKED_UP', '수령 완료'],
  ['CANCELED', '주문 취소']
])('%s 상태이면 목록에 %s 라벨을 표시한다', (status, label) => {
  const renderer = renderOrder({ ...ORDER, status });
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(texts).toContain(label);
});

test('CANCELED 주문이면 금액에 취소선을 표시한다', () => {
  const renderer = renderOrder({ ...ORDER, status: 'CANCELED' });
  const price = renderer.root.findAllByType(Text).find((node) => node.props.children === '8,500원');

  expect(price?.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
  );
});
