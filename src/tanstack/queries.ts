import { fetchMockOrders } from '@/components/(tabs)/orders/mock';

// TODO: API 연결 시 API.orders(cursor)로 교체
export async function getOrders(cursor: string | null) {
  return fetchMockOrders(cursor);
}
