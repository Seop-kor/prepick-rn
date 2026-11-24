import { expect, jest, test } from '@jest/globals';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { ActivityIndicator, SectionList, Text } from 'react-native';
import { router } from 'expo-router';

import OrdersScreen from '@/app/(tabs)/orders';
import OrdersSkeleton from '@/components/(tabs)/orders/OrdersSkeleton';
import AlertModal from '@/components/AlertModal';
import type { Order } from '@/graphql/queries';
import { useOrders } from '@/tanstack/hooks';

jest.mock('@rneui/themed', () => ({
  Text: jest.requireActual<typeof import('react-native')>('react-native').Text
}));
jest.mock('expo-router', () => ({ router: { navigate: jest.fn() } }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('@/components/AlertModal', () => ({ __esModule: true, default: jest.fn(() => null) }));
jest.mock('@/components/(tabs)/orders/OrdersSkeleton', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));
jest.mock('@/tanstack/hooks', () => ({ useOrders: jest.fn() }));

const useOrdersMock = jest.mocked(useOrders);

function makeOrder(id: string, overrides: Partial<Order> = {}): Order {
  return {
    id,
    storeId: 'store-1',
    storeName: '브루랩 강남점',
    prefixOrderNumber: 'A123',
    orderNumber: 123,
    status: 'READY',
    amount: 4000,
    request: null,
    createdAt: '2026-01-01T09:00:00.000Z',
    paidAt: '2026-01-01T09:00:00.000Z',
    items: [
      {
        id: `item-${id}`,
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

function mockOrders(
  pages: { items: Order[]; nextCursor: string | null }[],
  overrides: Record<string, unknown> = {}
) {
  const fetchNextPage = jest.fn();
  const refetch = jest.fn();
  useOrdersMock.mockReturnValue({
    data: { pages },
    isPending: false,
    isError: false,
    isFetching: false,
    isFetchNextPageError: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage,
    refetch,
    ...overrides
  } as never);
  return { fetchNextPage, refetch };
}

function renderScreen(): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<OrdersScreen />);
  });
  return renderer;
}

test('AC-3: 초기 조회에 실패하면 기존 AlertModal로 전체 재조회한다', () => {
  const query = mockOrders([], { isError: true, isFetching: true });
  const renderer = renderScreen();
  const alert = renderer.root.findByType(AlertModal);

  expect(alert.props).toEqual(
    expect.objectContaining({
      isVisible: true,
      title: '주문내역을 불러오지 못했어요',
      message: '네트워크 연결을 확인하고 다시 시도해주세요.',
      buttonTitle: '다시 시도',
      isLoading: true
    })
  );

  act(() => {
    alert.props.onClose();
  });

  expect(query.refetch).toHaveBeenCalledTimes(1);
  expect(query.fetchNextPage).not.toHaveBeenCalled();
});

test('AC-3: 다음 페이지 조회에 실패하면 목록을 유지한 채 같은 페이지를 다시 조회한다', () => {
  const query = mockOrders([{ items: [makeOrder('order-1')], nextCursor: 'cursor-2' }], {
    isError: true,
    isFetchNextPageError: true,
    hasNextPage: true
  });
  const renderer = renderScreen();
  const alert = renderer.root.findByType(AlertModal);

  expect(alert.props.isVisible).toBe(true);
  expect(renderer.root.findAllByType(SectionList)).toHaveLength(1);

  act(() => {
    alert.props.onClose();
  });

  expect(query.fetchNextPage).toHaveBeenCalledTimes(1);
  expect(query.refetch).not.toHaveBeenCalled();
});

test('AC-3: 초기 조회 중에는 기존 주문내역 스켈레톤을 표시한다', () => {
  mockOrders([], { isPending: true });

  const renderer = renderScreen();

  expect(renderer.root.findAllByType(OrdersSkeleton)).toHaveLength(1);
  expect(renderer.root.findAllByType(SectionList)).toHaveLength(0);
});

test('AC-3: 주문이 없으면 기존 빈 상태와 매장 찾기 동작을 유지한다', () => {
  mockOrders([{ items: [], nextCursor: null }]);
  const renderer = renderScreen();
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(texts).toEqual(
    expect.arrayContaining([
      '아직 주문한 내역이 없어요',
      '미리 주문하면 여기서\n준비 상태를 볼 수 있어요.',
      '주문할 매장 찾기'
    ])
  );

  act(() => {
    renderer.root.findByProps({ accessibilityRole: 'button' }).props.onPress();
  });

  expect(router.navigate).toHaveBeenCalledWith('/home');
});

test('AC-1: 응답 페이지를 받으면 날짜별로 묶고 주문 행에 응답 값을 표시한다', () => {
  const first = makeOrder('order-1');
  const second = makeOrder('order-2', {
    storeName: '커피하우스 역삼점',
    amount: 9000,
    createdAt: '2026-01-01T10:00:00',
    items: [{ ...first.items[0], id: 'item-2', productName: '카페라떼', quantity: 2, price: 4500 }]
  });
  const previous = makeOrder('order-3', { createdAt: '2025-12-31T10:00:00' });
  mockOrders([
    { items: [first, second], nextCursor: 'cursor-2' },
    { items: [previous], nextCursor: null }
  ]);

  const renderer = renderScreen();
  const list = renderer.root.findByType(SectionList);
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);

  expect(list.props.sections.map((section: { title: string }) => section.title)).toEqual([
    '1월 1일 목요일',
    '12월 31일 수요일'
  ]);
  expect(list.props.sections[0].data.map((order: Order) => order.id)).toEqual(['order-1', 'order-2']);
  expect(texts).toEqual(expect.arrayContaining(['커피하우스 역삼점', '카페라떼', '9,000원', '준비 완료']));
});

test('AC-2: nextCursor가 있으면 목록 끝에서 다음 페이지를 조회하고 null이면 조회하지 않는다', () => {
  const page = [{ items: [makeOrder('order-1')], nextCursor: null }];
  const next = mockOrders(page, { hasNextPage: true });
  const withNextPage = renderScreen();

  act(() => {
    withNextPage.root.findByType(SectionList).props.onEndReached();
  });

  expect(next.fetchNextPage).toHaveBeenCalledTimes(1);

  const last = mockOrders(page, { hasNextPage: false });
  const withoutNextPage = renderScreen();

  act(() => {
    withoutNextPage.root.findByType(SectionList).props.onEndReached();
  });

  expect(last.fetchNextPage).not.toHaveBeenCalled();
});

test('AC-2: 다음 페이지를 불러오는 동안 추가 로딩을 표시하고 중복 요청하지 않는다', () => {
  const next = mockOrders([{ items: [makeOrder('order-1')], nextCursor: 'cursor-2' }], {
    hasNextPage: true,
    isFetchingNextPage: true
  });
  const renderer = renderScreen();

  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);

  act(() => {
    renderer.root.findByType(SectionList).props.onEndReached();
  });

  expect(next.fetchNextPage).not.toHaveBeenCalled();
});

test('AC-2: 페이지 경계에 같은 주문이 다시 와도 목록에 한 번만 표시한다', () => {
  const first = makeOrder('order-1');
  const second = makeOrder('order-2');
  mockOrders([
    { items: [first], nextCursor: 'cursor-2' },
    { items: [first, second], nextCursor: null }
  ]);

  const renderer = renderScreen();
  const list = renderer.root.findByType(SectionList);
  const orders = list.props.sections.flatMap((section: { data: Order[] }) => section.data);

  expect(orders.map((order: Order) => order.id)).toEqual(['order-1', 'order-2']);
});
