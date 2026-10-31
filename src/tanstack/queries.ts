import { fetchMockOrders } from '@/components/(tabs)/orders/mock';
import API from '@/service/api';
import type { Coords } from '@/stores/location';

const NEARBY_STORE_SIZE = 5;
const NEW_STORE_SIZE = 10;

export async function getCurrentUser() {
  return API.currentUser();
}

export async function getPromotions() {
  return API.promotions();
}

export async function getNearbyStores({ latitude, longitude }: Coords) {
  return API.stores(latitude, longitude, NEARBY_STORE_SIZE);
}

export async function getNewStores() {
  return API.newStores(NEW_STORE_SIZE);
}

// TODO: API 연결 시 API.orders(cursor)로 교체
export async function getOrders(cursor: string | null) {
  return fetchMockOrders(cursor);
}
