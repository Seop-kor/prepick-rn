// TODO: API 연결 시 codegen 타입과 쿼리 결과로 교체 (schema의 Order에 status 필드 추가 필요)
export type OrderStatus =
  'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'CANCELED' | 'REJECTED';

export type OrderItem = {
  id: string;
  productName: string;
  skuName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  storeId: string;
  storeName: string;
  prefixOrderNumber: string;
  status: OrderStatus;
  amount: number;
  request: string | null;
  createdAt: string;
  paidAt: string;
  items: OrderItem[];
};

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * MINUTE).toISOString();
}

function item(id: string, productName: string, skuName: string, quantity: number, price: number): OrderItem {
  return { id, productName, skuName, quantity, price };
}

function order(
  id: string,
  storeId: string,
  storeName: string,
  prefixOrderNumber: string,
  status: OrderStatus,
  minutes: number,
  items: OrderItem[],
  request: string | null = null
): Order {
  const createdAt = minutesAgo(minutes);
  return {
    id,
    storeId,
    storeName,
    prefixOrderNumber,
    status,
    amount: items.reduce((sum, { price, quantity }) => sum + price * quantity, 0),
    request,
    createdAt,
    paidAt: createdAt,
    items
  };
}

// 다음 페이지 로딩을 확인할 수 있도록 지난 주문을 넉넉히 만든다
const PAST_STORES = [
  ['s1', '브루랩 강남점', '아메리카노', 4000],
  ['s2', '커피하우스 역삼점', '카페라떼', 4500],
  ['s3', '그린볼 샐러드', '콥 샐러드', 10500],
  ['s4', '오븐온 역삼점', '소금빵', 3200],
  ['s5', '티하우스 담', '자몽 허니 블랙티', 5800]
] as const;

const PAST_ORDERS = Array.from({ length: 24 }, (_, i) => {
  const [storeId, storeName, productName, price] = PAST_STORES[i % PAST_STORES.length];
  return order(
    `p${i}`,
    storeId,
    storeName,
    `A${String(80 - i).padStart(3, '0')}`,
    'PICKED_UP',
    (20 + i * 3) * (DAY / MINUTE),
    [item(`p${i}-1`, productName, 'ICE', 1 + (i % 2), price)]
  );
});

export const MOCK_ORDERS: Order[] = [
  order('o1', 's2', '커피하우스 역삼점', 'A118', 'READY', 12, [item('i1', '바닐라 라떼', 'ICE', 1, 5000)]),
  order(
    'o2',
    's1',
    '브루랩 강남점',
    'A123',
    'PREPARING',
    5,
    [item('i2', '아메리카노', 'ICE', 2, 4000), item('i3', '카페라떼', 'HOT', 1, 4500)],
    '빨대 주세요.'
  ),
  order(
    'o3',
    's2',
    '커피하우스 역삼점',
    'A102',
    'PICKED_UP',
    (2 * DAY) / MINUTE,
    [item('i4', '아메리카노', 'ICE', 1, 4000)],
    '얼음 적게 주세요.'
  ),
  order('o4', 's4', '오븐온 역삼점', 'A099', 'PICKED_UP', (6 * DAY) / MINUTE, [
    item('i5', '소금빵', '기본', 2, 3200),
    item('i6', '크루아상', '기본', 1, 3400),
    item('i7', '아메리카노', 'HOT', 1, 2000)
  ]),
  order('o5', 's5', '티하우스 담', 'A097', 'REJECTED', (6 * DAY) / MINUTE + 90, [
    item('i8', '얼그레이 밀크티', 'ICE', 1, 5500)
  ]),
  order('o6', 's3', '그린볼 샐러드', 'A090', 'PICKED_UP', (18 * DAY) / MINUTE, [
    item('i9', '시저 샐러드', '기본', 1, 9900)
  ]),
  order('o7', 's1', '브루랩 강남점', 'A088', 'CANCELED', (18 * DAY) / MINUTE + 120, [
    item('i10', '카페라떼', 'ICE', 1, 4500),
    item('i11', '바닐라 라떼', 'ICE', 1, 4500)
  ]),
  ...PAST_ORDERS
];

const PAGE_SIZE = 10;

// TODO: API 연결 시 orders(cursor, size) 쿼리로 교체. 목업 cursor는 다음 페이지 시작 위치
export async function fetchMockOrders(cursor: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const start = cursor ? Number(cursor) : 0;
  const end = start + PAGE_SIZE;
  return {
    items: MOCK_ORDERS.slice(start, end),
    nextCursor: end < MOCK_ORDERS.length ? String(end) : null
  };
}
