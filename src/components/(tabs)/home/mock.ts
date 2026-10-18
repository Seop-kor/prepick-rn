// TODO: API 연결 시 codegen 타입과 쿼리 결과로 교체
export type Store = {
  id: string;
  name: string;
  category: string;
  address: string;
  distanceMeters: number | null;
  isOpen: boolean;
  imageUrl: string | null;
  createdAt: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
};

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY).toISOString();
}

function store(
  id: string,
  name: string,
  category: string,
  distanceMeters: number,
  isOpen: boolean,
  days = 90
): Store {
  return {
    id,
    name,
    category,
    address: '서울 강남구 역삼동',
    distanceMeters,
    isOpen,
    imageUrl: null,
    createdAt: daysAgo(days)
  };
}

export const MOCK_HOME = {
  isLoading: false,
  isError: false,
  isLocationGranted: true,
  locationName: '역삼동',
  user: { name: '홍길동' },
  promotions: [
    {
      id: 'p1',
      title: '첫 주문을 시작해보세요',
      description: '주변 인기 카페를 줄 서지 않고 주문할 수 있어요.',
      imageUrl: null
    },
    {
      id: 'p2',
      title: '출근길 3분 픽업',
      description: '회사 가는 길에 미리 주문하고 바로 받아가세요.',
      imageUrl: null
    },
    {
      id: 'p3',
      title: '새로 입점한 매장',
      description: '이번 주 역삼동에 새로 들어온 매장을 만나보세요.',
      imageUrl: null
    }
  ] satisfies Promotion[],
  stores: [
    store('s1', '브루랩 강남점', '카페', 350, true),
    store('s2', '커피하우스 역삼점', '카페', 620, true),
    store('s3', '그린볼 샐러드', '샐러드', 910, true),
    store('s4', '오븐온 역삼점', '베이커리', 1100, false),
    store('s5', '티하우스 담', '티', 1400, true)
  ],
  newStores: [
    store('n1', '로스터리 무하', '카페', 1800, true, 2),
    store('n2', '버터앤솔트', '베이커리', 2400, true, 3),
    store('n3', '마카롱 상점', '디저트', 2900, true, 5),
    store('n4', '잎새 티룸', '티', 3300, true, 6)
  ],
  cart: null as { store: Store; itemCount: number; totalPrice: number } | null
};
