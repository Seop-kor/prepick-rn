import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytes } from 'expo-crypto';
import { useMemo } from 'react';
import { v7 as uuidv7 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartStore = { id: string; name: string; category: string; imageUrl: string | null };

// createOrder의 OrderItemInput과 같은 모양
export type CartItem = {
  productId: string;
  productName: string;
  skuId: string;
  skuName: string;
  price: number;
  quantity: number;
};

export type CartSummary = { store: CartStore; itemCount: number; totalPrice: number };

type CartState = {
  store: CartStore | null;
  items: CartItem[];
  // createOrder 멱등키. 내용이 바뀔 때마다 새로 발급
  cartId: string | null;
};

const EMPTY_CART: CartState = { store: null, items: [], cartId: null };

const useCartStore = create<CartState>()(
  persist(() => EMPTY_CART, { name: 'cart', storage: createJSONStorage(() => AsyncStorage) })
);

function createCartId() {
  return uuidv7({ rng: () => getRandomBytes(16) });
}

function summarize(store: CartStore | null, items: CartItem[]): CartSummary | null {
  if (!store || items.length === 0) return null;
  return {
    store,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
}

function replaceItems(items: CartItem[]) {
  if (items.length === 0) {
    clearCart();
    return;
  }
  useCartStore.setState({ items, cartId: createCartId() });
}

// hooks
export function useCartSummary() {
  const store = useCartStore((state) => state.store);
  const items = useCartStore((state) => state.items);
  return useMemo(() => summarize(store, items), [store, items]);
}

// getter
export function getCartSummary() {
  const { store, items } = useCartStore.getState();
  return summarize(store, items);
}

export function getCartStoreId() {
  return useCartStore.getState().store?.id ?? null;
}

export function getCartId() {
  return useCartStore.getState().cartId;
}

export function getCartItems() {
  return useCartStore.getState().items;
}

// actions
// 다른 매장 상품이면 기존 상품을 버린다. 교체 확인은 호출하는 쪽에서 한다
export function addCartItem(store: CartStore, item: CartItem) {
  const state = useCartStore.getState();
  const items = state.store?.id === store.id ? state.items : [];
  const existing = items.find((i) => i.skuId === item.skuId);
  const nextItems = existing
    ? items.map((i) => (i.skuId === item.skuId ? { ...i, quantity: i.quantity + item.quantity } : i))
    : [...items, item];
  useCartStore.setState({ store, items: nextItems, cartId: createCartId() });
}

export function setCartItemQuantity(skuId: string, quantity: number) {
  if (quantity < 1) return;
  const { items } = useCartStore.getState();
  const target = items.find((i) => i.skuId === skuId);
  if (!target || target.quantity === quantity) return;
  replaceItems(items.map((i) => (i.skuId === skuId ? { ...i, quantity } : i)));
}

export function removeCartItem(skuId: string) {
  const { items } = useCartStore.getState();
  if (!items.some((i) => i.skuId === skuId)) return;
  replaceItems(items.filter((i) => i.skuId !== skuId));
}

export function clearCart() {
  useCartStore.setState(EMPTY_CART);
}
