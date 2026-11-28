import { beforeEach, expect, jest, test } from '@jest/globals';
import { Text } from 'react-native';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

import MoreScreen from '@/app/(tabs)/more';
import AlertModal from '@/components/AlertModal';
import { SkeletonBlock } from '@/components/Skeleton';
import { useCurrentUser, useLogout } from '@/tanstack/hooks';

jest.mock('@rneui/themed', () => ({
  Text: jest.requireActual<typeof import('react-native')>('react-native').Text
}));
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { version: '1.2.3' } } }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.requireActual<typeof import('react-native')>('react-native').View
}));
jest.mock('@/components/AlertModal', () => ({ __esModule: true, default: jest.fn(() => null) }));
jest.mock('@/components/Skeleton', () => ({ SkeletonBlock: jest.fn(() => null) }));
jest.mock('@/tanstack/hooks', () => ({ useCurrentUser: jest.fn(), useLogout: jest.fn() }));

const useCurrentUserMock = jest.mocked(useCurrentUser);
const useLogoutMock = jest.mocked(useLogout);
const logoutMock = jest.fn();

function mockQuery(overrides: Record<string, unknown> = {}) {
  return { data: undefined, isPending: false, isError: false, ...overrides };
}

beforeEach(() => {
  jest.clearAllMocks();
  useCurrentUserMock.mockReturnValue(mockQuery({ data: { name: '홍길동' } }) as never);
  useLogoutMock.mockReturnValue({ mutate: logoutMock } as never);
});

function renderScreen(): ReactTestRenderer {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(<MoreScreen />);
  });
  return renderer;
}

function texts(renderer: ReactTestRenderer) {
  return renderer.root.findAllByType(Text).map((node) => node.props.children);
}

function openLogout(renderer: ReactTestRenderer) {
  act(() => {
    renderer.root.findByProps({ accessibilityRole: 'button' }).props.onPress();
  });
  return renderer.root.findByType(AlertModal);
}

test('이름 조회에 성공하면 이름을 {이름}님으로 표시한다', () => {
  const renderer = renderScreen();

  expect(texts(renderer)).toContainEqual(['홍길동', '님']);
  expect(renderer.root.findAllByType(SkeletonBlock)).toHaveLength(0);
});

test('이름 조회 중이면 스켈레톤을 표시한다', () => {
  useCurrentUserMock.mockReturnValue(mockQuery({ isPending: true }) as never);

  const renderer = renderScreen();

  expect(renderer.root.findAllByType(SkeletonBlock)).toHaveLength(1);
});

test('이름 조회에 실패하면 프로필 영역을 숨기고 앱 버전과 로그아웃은 표시한다', () => {
  useCurrentUserMock.mockReturnValue(mockQuery({ isPending: false, isError: true }) as never);

  const renderer = renderScreen();

  expect(renderer.root.findAllByType(SkeletonBlock)).toHaveLength(0);
  expect(texts(renderer)).toEqual(['더보기', '앱 버전', '1.2.3', '로그아웃']);
});

test('확인 모달에서 로그아웃하면 모달을 닫고 로그아웃을 실행한다', () => {
  const renderer = renderScreen();

  act(() => {
    openLogout(renderer).props.onClose();
  });

  expect(logoutMock).toHaveBeenCalledTimes(1);
  expect(renderer.root.findByType(AlertModal).props.isVisible).toBe(false);
});

test('확인 모달에서 취소하면 모달만 닫고 로그아웃을 실행하지 않는다', () => {
  const renderer = renderScreen();

  act(() => {
    openLogout(renderer).props.onCancel();
  });

  expect(logoutMock).not.toHaveBeenCalled();
  expect(renderer.root.findByType(AlertModal).props.isVisible).toBe(false);
});
