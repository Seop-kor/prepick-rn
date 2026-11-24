import { expect, jest, test } from '@jest/globals';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { ActivityIndicator, Text } from 'react-native';

import OrderDetailScreen from '@/app/(tabs)/orders/[id]';
import AlertModal from '@/components/AlertModal';
import type { Order } from '@/graphql/queries';
import { useOrder } from '@/tanstack/hooks';

jest.mock('@rneui/themed', () => ({
  Text: jest.requireActual<typeof import('react-native')>('react-native').Text
}));
jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => ({ id: 'order-1' })
}));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('@/components/AlertModal', () => ({ __esModule: true, default: jest.fn(() => null) }));
jest.mock('@/tanstack/hooks', () => ({ useOrder: jest.fn() }));

const useOrderMock = jest.mocked(useOrder);

const ORDER: Order = {
  id: 'order-1',
  storeId: 'store-1',
  storeName: '브루랩 강남점',
  prefixOrderNumber: 'A123',
  orderNumber: 123,
  status: 'READY',
  amount: 8500,
  request: '빨대 주세요.',
  createdAt: '2026-01-01T09:00:00.000Z',
  paidAt: '2026-01-01T09:05:00.000Z',
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      productName: '커피',
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

function mockOrder(overrides: Record<string, unknown> = {}) {
  const refetch = jest.fn();
  useOrderMock.mockReturnValue({
    data: ORDER,
    isPending: false,
    isError: false,
    isFetching: false,
    refetch,
    ...overrides
  } as never);
  return { refetch };
}

function renderScreen(): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<OrderDetailScreen />);
  });
  return renderer;
}

function textValues(renderer: ReactTestRenderer) {
  const flatten = (value: unknown): string => {
    if (Array.isArray(value)) return value.map(flatten).join('');
    return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  };
  return renderer.root.findAllByType(Text).map((node) => flatten(node.props.children));
}

test('AC-5: 상세가 초기 로딩 중이면 ActivityIndicator를 표시한다', () => {
  mockOrder({ data: undefined, isPending: true });

  const renderer = renderScreen();

  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);
  expect(renderer.root.findAllByType(Text).map((node) => node.props.children)).not.toContain(
    '주문 정보를 찾을 수 없어요.'
  );
});

test('AC-5: 조회에 실패하면 정보 없음과 구분되는 오류와 재시도 동작을 표시한다', () => {
  const query = mockOrder({ data: undefined, isError: true, isFetching: true });
  const renderer = renderScreen();
  const alert = renderer.root.findByType(AlertModal);

  expect(alert.props).toEqual(
    expect.objectContaining({
      isVisible: true,
      title: '주문 정보를 불러오지 못했어요',
      message: '네트워크 연결을 확인하고 다시 시도해주세요.',
      buttonTitle: '다시 시도',
      isLoading: true
    })
  );
  expect(renderer.root.findAllByType(Text).map((node) => node.props.children)).not.toContain(
    '주문 정보를 찾을 수 없어요.'
  );

  act(() => {
    alert.props.onClose();
  });

  expect(query.refetch).toHaveBeenCalledTimes(1);
});

test('AC-5: API가 null을 반환한 경우에만 주문 정보 없음을 표시한다', () => {
  mockOrder({ data: null });

  const renderer = renderScreen();

  expect(renderer.root.findAllByType(Text).map((node) => node.props.children)).toContain(
    '주문 정보를 찾을 수 없어요.'
  );
  expect(renderer.root.findAllByType(AlertModal)).toHaveLength(0);
});

test('AC-4: order(id)가 주문을 반환하면 기존 상세 UI에 모든 주문 정보를 표시한다', () => {
  mockOrder({
    data: { ...ORDER, createdAt: '2026-01-01T09:00:00', paidAt: '2026-01-01T09:05:00' }
  });

  const renderer = renderScreen();
  const texts = textValues(renderer);

  expect(useOrderMock).toHaveBeenCalledWith('order-1');
  expect(texts).toEqual(
    expect.arrayContaining([
      '브루랩 강남점',
      '카운터에서 받아가세요',
      'A123',
      '커피 ',
      'ICE × 1',
      '카페라떼 ',
      'HOT × 1',
      '4,000원',
      '4,500원',
      '8,500원',
      '빨대 주세요.',
      '2026.01.01 09:00',
      '2026.01.01 09:05',
      '매장 보기'
    ])
  );
});

test('AC-8: 주문이 CANCELED이면 취소 문구와 총 금액 취소선을 표시하고 거절 전용 문구를 표시하지 않는다', () => {
  mockOrder({ data: { ...ORDER, status: 'CANCELED' } });

  const renderer = renderScreen();
  const texts = textValues(renderer);
  const total = renderer.root.findAllByType(Text).find((node) => node.props.children === '8,500원');

  expect(texts).toContain('주문이 취소됐어요');
  expect(texts).not.toContain('매장 사정으로 주문을 받지 못했어요.');
  expect(total?.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
  );
});

test.each<[Order['status'], string, string | null]>([
  ['CREATED', '주문을 확인하고 있어요', '확인'],
  ['CONFIRMED', '주문이 접수됐어요', '접수'],
  ['IN_PROGRESS', '메뉴를 만들고 있어요', '준비'],
  ['READY', '카운터에서 받아가세요', '픽업 가능'],
  ['PICKED_UP', '픽업을 완료했어요', null],
  ['CANCELED', '주문이 취소됐어요', null]
])('AC-6/AC-7: 주문이 %s이면 합의한 문구와 진행 단계를 표시한다', (status, message, currentStep) => {
  mockOrder({ data: { ...ORDER, status } });

  const renderer = renderScreen();
  const steppers = renderer.root.findAll(
    (node) =>
      typeof node.props.accessibilityLabel === 'string' &&
      node.props.accessibilityLabel.startsWith('주문 진행 단계')
  );

  expect(textValues(renderer)).toContain(message);
  expect([...new Set(steppers.map((node) => node.props.accessibilityLabel))]).toEqual(
    currentStep ? [`주문 진행 단계 ${currentStep}`] : []
  );
});
