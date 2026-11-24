import { beforeEach, expect, jest, test } from '@jest/globals';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { ScrollView, Text } from 'react-native';

import HomeScreen from '@/app/(tabs)/home';
import HomeSkeleton from '@/components/(tabs)/home/HomeSkeleton';
import LiveOrderBar from '@/components/(tabs)/home/LiveOrderBar';
import AlertModal from '@/components/AlertModal';
import type { Order } from '@/graphql/queries';
import {
  useCurrentUser,
  useNearbyStores,
  useOngoingOrders,
  useNewStores,
  usePromotions
} from '@/tanstack/hooks';

jest.mock('@rneui/themed', () => ({
  Text: jest.requireActual<typeof import('react-native')>('react-native').Text
}));
jest.mock('expo-router', () => ({ useFocusEffect: jest.fn() }));
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: { View: jest.requireActual<typeof import('react-native')>('react-native').View },
  FadeIn: { duration: jest.fn() },
  FadeOut: { duration: jest.fn() }
}));
jest.mock('@/components/AlertModal', () => ({ __esModule: true, default: jest.fn(() => null) }));
jest.mock('@/components/(tabs)/home/HomeSkeleton', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));
jest.mock('@/components/(tabs)/home/LiveOrderBar', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));
jest.mock('@/components/(tabs)/home/CartBar', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/(tabs)/home/NewStoreCard', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/(tabs)/home/PromotionCarousel', () => ({
  __esModule: true,
  default: () => null
}));
jest.mock('@/components/(tabs)/home/SectionHeader', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/(tabs)/home/SectionNotice', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/(tabs)/home/StoreRow', () => ({ __esModule: true, default: () => null }));
jest.mock('@/stores/cart', () => ({ useCartSummary: () => null }));
jest.mock('@/stores/location', () => ({
  refreshLocationPermission: jest.fn(),
  useCoords: () => null,
  useHasLocateFailed: () => false,
  useLocationName: () => null,
  useLocationPermission: () => 'unknown'
}));
jest.mock('@/tanstack/hooks', () => ({
  useCurrentUser: jest.fn(),
  useNearbyStores: jest.fn(),
  useNewStores: jest.fn(),
  useOngoingOrders: jest.fn(),
  usePromotions: jest.fn()
}));

const useCurrentUserMock = jest.mocked(useCurrentUser);
const useNearbyStoresMock = jest.mocked(useNearbyStores);
const useNewStoresMock = jest.mocked(useNewStores);
const useOngoingOrdersMock = jest.mocked(useOngoingOrders);
const usePromotionsMock = jest.mocked(usePromotions);

function mockQuery(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    isPending: false,
    isError: false,
    refetch: jest.fn(),
    ...overrides
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  useCurrentUserMock.mockReturnValue(mockQuery({ data: { name: '홍길동' } }) as never);
  useNearbyStoresMock.mockReturnValue(mockQuery() as never);
  useNewStoresMock.mockReturnValue(mockQuery({ data: [] }) as never);
  useOngoingOrdersMock.mockReturnValue(mockQuery({ data: [] }) as never);
  usePromotionsMock.mockReturnValue(mockQuery({ data: [] }) as never);
});

function renderScreen(): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<HomeScreen />);
  });
  return renderer;
}

test('AC-9/AC-12: 진행 중 주문 쿼리가 응답하면 홈 주문 바는 MOCK 대신 그 응답을 사용한다', () => {
  const orders = [{ id: 'server-order' } as Order];
  useOngoingOrdersMock.mockReturnValue(mockQuery({ data: orders }) as never);

  const renderer = renderScreen();

  expect(useOngoingOrdersMock).toHaveBeenCalledTimes(1);
  expect(renderer.root.findByType(LiveOrderBar).props.orders).toBe(orders);
});

test('AC-10: 진행 중 주문이 초기 로딩 중이면 기존 HomeSkeleton을 표시한다', () => {
  useOngoingOrdersMock.mockReturnValue(mockQuery({ isPending: true }) as never);

  const renderer = renderScreen();

  expect(renderer.root.findAllByType(HomeSkeleton)).toHaveLength(1);
  expect(renderer.root.findAllByType(LiveOrderBar)).toHaveLength(0);
});

test('AC-11: 진행 중 주문 조회에 실패하면 본문과 공통 오류에서 분리하고 주문 바와 여백만 숨긴다', () => {
  const refetch = jest.fn();
  useOngoingOrdersMock.mockReturnValue(
    mockQuery({ data: [{ id: 'stale-order' } as Order], isError: true, refetch }) as never
  );

  const renderer = renderScreen();
  const texts = renderer.root.findAllByType(Text).map((node) => node.props.children);
  const alert = renderer.root.findByType(AlertModal);

  expect(texts).toContain('홍길동님, 안녕하세요');
  expect(renderer.root.findAllByType(LiveOrderBar)).toHaveLength(0);
  expect(renderer.root.findByType(ScrollView).props.contentContainerStyle.paddingBottom).toBe(32);
  expect(alert.props.isVisible).toBe(false);

  act(() => {
    alert.props.onClose();
  });

  expect(refetch).not.toHaveBeenCalled();
});
