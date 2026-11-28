import { queryOptions } from '@tanstack/react-query';

import type { OrderStatus } from '@/graphql/__generated__/graphql';
import API from '@/service/api';
import type { Coords } from '@/stores/location';

const NEARBY_STORE_SIZE = 5;
const NEW_STORE_SIZE = 10;
const ORDER_PAGE_SIZE = 10;
const ONGOING_ORDER_STATUSES: OrderStatus[] = ['CREATED', 'CONFIRMED', 'IN_PROGRESS', 'READY'];

export async function getCurrentUser() {
  return API.currentUser();
}

export const currentUserQuery = queryOptions({ queryKey: ['currentUser'], queryFn: getCurrentUser });

export async function getPromotions() {
  return API.promotions();
}

export async function getNearbyStores({ latitude, longitude }: Coords) {
  return API.stores(latitude, longitude, NEARBY_STORE_SIZE);
}

export async function getNewStores() {
  return API.newStores(NEW_STORE_SIZE);
}

export async function getOrders(cursor: string | null) {
  return API.getOrders(cursor, ORDER_PAGE_SIZE);
}

export async function getOngoingOrders() {
  const orders = [];
  let cursor: string | null = null;

  do {
    const page = await API.getOrders(cursor, ORDER_PAGE_SIZE, ONGOING_ORDER_STATUSES);
    orders.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor !== null);

  return orders;
}
