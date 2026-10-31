import { expect, jest, test } from '@jest/globals';

import { clearTokens } from '@/stores/auth';

import { addCartItem, getCartId } from '@/stores/cart';
import { logout } from '@/stores/session';
import { queryClient } from '@/tanstack/client';

jest.mock('@/stores/auth', () => ({ clearTokens: jest.fn(() => Promise.resolve()) }));
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('expo-crypto', () => ({
  getRandomBytes: (size: number) =>
    new Uint8Array(jest.requireActual<typeof import('crypto')>('crypto').randomBytes(size))
}));

test('logout하면 토큰, 장바구니, 서버 데이터 캐시를 비운다', async () => {
  addCartItem(
    { id: 'a', name: 'A', category: '카페', imageUrl: null },
    { productId: 'p1', productName: '아메리카노', skuId: 's1', skuName: 'ICE', price: 4000, quantity: 1 }
  );

  queryClient.setQueryData(['currentUser'], { id: 'u1', name: '홍길동' });

  await logout();

  expect(clearTokens).toHaveBeenCalledTimes(1);
  expect(getCartId()).toBeNull();
  expect(queryClient.getQueryData(['currentUser'])).toBeUndefined();
});
