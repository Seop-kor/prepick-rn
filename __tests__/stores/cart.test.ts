import { beforeEach, expect, jest, test } from '@jest/globals';

import {
  addCartItem,
  clearCart,
  getCartId,
  getCartItems,
  getCartStoreId,
  getCartSummary,
  removeCartItem,
  setCartItemQuantity,
  type CartItem
} from '@/stores/cart';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('expo-crypto', () => ({
  getRandomBytes: (size: number) =>
    new Uint8Array(jest.requireActual<typeof import('crypto')>('crypto').randomBytes(size))
}));

const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const storeA = { id: 'a', name: 'A', category: '카페', imageUrl: null };
const storeB = { id: 'b', name: 'B', category: '베이커리', imageUrl: null };

function item(skuId: string, price: number, quantity: number): CartItem {
  return { productId: `p-${skuId}`, productName: '아메리카노', skuId, skuName: 'ICE', price, quantity };
}

beforeEach(() => {
  clearCart();
});

test('빈 장바구니에 담으면 매장과 cartId가 생긴다', () => {
  addCartItem(storeA, item('s1', 1000, 1));

  expect(getCartStoreId()).toBe('a');
  expect(getCartId()).toMatch(UUID_V7);
});

test('같은 sku를 다시 담으면 수량을 더한다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  addCartItem(storeA, item('s1', 1000, 2));

  expect(getCartItems()).toHaveLength(1);
  expect(getCartItems()[0].quantity).toBe(3);
});

test('다른 매장 상품을 담으면 기존 상품을 비우고 새 매장으로 바꾼다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  addCartItem(storeB, item('s2', 2000, 1));

  expect(getCartStoreId()).toBe('b');
  expect(getCartItems().map((i) => i.skuId)).toEqual(['s2']);
});

test('상품을 담으면 cartId가 바뀐다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  const before = getCartId();
  addCartItem(storeA, item('s2', 2000, 1));

  expect(getCartId()).not.toBe(before);
});

test('수량을 바꾸면 cartId가 바뀐다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  const before = getCartId();
  setCartItemQuantity('s1', 5);

  expect(getCartId()).not.toBe(before);
  expect(getCartItems()[0].quantity).toBe(5);
});

test('같은 수량으로 바꾸면 cartId가 유지된다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  const before = getCartId();
  setCartItemQuantity('s1', 1);

  expect(getCartId()).toBe(before);
});

test('상품을 삭제하면 cartId가 바뀐다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  addCartItem(storeA, item('s2', 2000, 1));
  const before = getCartId();
  removeCartItem('s1');

  expect(getCartId()).not.toBe(before);
  expect(getCartItems().map((i) => i.skuId)).toEqual(['s2']);
});

test('마지막 상품을 삭제하면 장바구니가 비워진다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  removeCartItem('s1');

  expect(getCartStoreId()).toBeNull();
  expect(getCartId()).toBeNull();
  expect(getCartSummary()).toBeNull();
});

test('clearCart하면 cartId도 초기화된다', () => {
  addCartItem(storeA, item('s1', 1000, 1));
  clearCart();

  expect(getCartId()).toBeNull();
  expect(getCartItems()).toEqual([]);
});

test('상품을 담으면 요약에 수량 합과 금액 합이 나온다', () => {
  addCartItem(storeA, item('s1', 4000, 2));
  addCartItem(storeA, item('s2', 4500, 1));

  expect(getCartSummary()).toEqual({ store: storeA, itemCount: 3, totalPrice: 12500 });
});
