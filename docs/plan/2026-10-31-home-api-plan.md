# Home API 연동 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 화면의 `MOCK_HOME`을 GraphQL 쿼리, 위치 store, persist되는 장바구니 store로 교체한다.

**Architecture:** 위치(`src/stores/location.ts`, 메모리)와 장바구니(`src/stores/cart.ts`, AsyncStorage persist)는 `src/stores/auth.ts`처럼 zustand store + hooks/getter/actions 함수로 만든다. 서버 데이터는 기존 흐름(`src/graphql/queries.ts` → `src/service/api.ts` → `src/tanstack/queries.ts` → `src/tanstack/hooks.ts`)을 따른다. 홈 화면은 이 둘을 읽기만 한다.

**Tech Stack:** Expo 57, expo-router, zustand 5, TanStack Query 5, graphql-codegen(client preset), expo-location ~57.0.22, expo-crypto ~57.0.4, uuid ^14.0.3, AsyncStorage 2.2.0, jest-expo(이번에 추가)

**Spec:** `docs/spec/2026-10-31-home-api-design.md`

## Global Constraints

- 코드 규칙은 `CLAUDE.md`를 따른다. 컴포넌트 핸들러는 `handle~`, boolean은 `is`/`has`, 주석은 꼭 필요할 때만 한글로, 함수는 이름이 말하는 일만 한다.
- 테스트 이름은 `~하면 ~한다` 형식으로 쓴다.
- 위치 권한 팝업은 상태가 `undetermined`일 때 `initLocation`에서만 요청한다. 다른 곳에서는 `requestForegroundPermissionsAsync`를 호출하지 않는다.
- 좌표는 실행당 한 번 가져와서 고정한다. 실패한 시도는 한 번으로 치지 않는다.
- 위치 store는 persist하지 않는다. 장바구니 store는 persist한다.
- `clearTokens()`는 수정하지 않는다. 로그아웃 시 장바구니 비우기는 `logout()`이 담당한다.
- 진행 중 주문 바는 `MOCK_ORDERS`를 그대로 둔다.
- 커밋 메시지는 저장소 스타일(`add: ...`, `fix: ...`)을 따른다.

## Review Focus

1. 사용자가 설정에서 권한을 끈 뒤 홈을 오가도 팝업이 뜨면 안 된다. Android에서는 이 상태가 `denied`이다. Task 3 테스트가 `refresh`/`init`의 `request` 미호출을 고정한다.
2. 설정에서 권한을 켜고 앱으로 돌아오면 탭 이동 없이도 가까운 매장이 나와야 한다(`AppState` 경로). 실기기 확인은 Task 5 Step 4에서 한다.
3. 응답을 못 받아 재시도할 때는 같은 `cartId`를 써야 하고, 내용이 바뀌면 새 `cartId`를 써야 한다. 같은 수량으로 바꾸는 것은 변경이 아니다. Task 1 테스트로 고정한다.
4. 다른 계정으로 로그인했을 때 이전 사용자의 장바구니가 보이면 안 된다. Task 2 테스트로 고정한다.
5. 홈 진입과 앱 시작이 겹쳐 좌표를 두 번 가져오거나, 이미 좌표가 있는데 다시 가져오면 안 된다. Task 3 테스트로 고정한다.

---

### Task 1: 장바구니 store + 테스트 환경

**Files:**
- Create: `src/stores/cart.ts`
- Create: `src/stores/__tests__/cart.test.ts`
- Modify: `package.json` (jest 설정, `test` 스크립트)

**Interfaces:**
- Consumes: `Store`, `OrderItemInput` 타입(`@/graphql/__generated__/graphql`)
- Produces:
  ```ts
  export type CartStore = Pick<Store, 'id' | 'name' | 'category' | 'imageUrl'>;
  export type CartItem = OrderItemInput;
  export type CartSummary = { store: CartStore; itemCount: number; totalPrice: number };
  export function useCartSummary(): CartSummary | null;
  export function getCartSummary(): CartSummary | null;
  export function getCartStoreId(): string | null;
  export function getCartId(): string | null;
  export function getCartItems(): CartItem[];
  export function addCartItem(store: CartStore, item: CartItem): void;
  export function setCartItemQuantity(skuId: string, quantity: number): void;
  export function removeCartItem(skuId: string): void;
  export function clearCart(): void;
  ```

- [ ] **Step 1: 브랜치를 만들고 대기 중인 변경을 커밋한다**

```bash
git checkout -b feature/home-api
git add docs/spec/2026-10-31-home-api-design.md docs/plan/2026-10-31-home-api-plan.md CLAUDE.md package.json yarn.lock
git commit -m "add: home api design and dependencies"
```

- [ ] **Step 2: jest-expo를 설치하고 설정한다**

`npx expo install jest-expo jest @types/jest -- --dev`를 실행한다. `package.json`에 `"test": "jest"` 스크립트를 넣는다. jest 설정은 다음과 같다.

```json
"jest": {
  "preset": "jest-expo",
  "moduleNameMapper": { "^@/(.*)$": "<rootDir>/src/$1" },
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|uuid)"
  ]
}
```

`uuid` v14는 ESM 전용(`"type": "module"`)이다. 그래서 jest-expo 기본 패턴에 `uuid`를 추가해 babel이 변환하도록 한다.

- [ ] **Step 3: 실패하는 테스트를 쓴다**

파일 맨 위에 다음 mock을 둔다.

```ts
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('expo-crypto', () => ({
  getRandomBytes: (size: number) => new Uint8Array(require('crypto').randomBytes(size))
}));
```

`beforeEach`에서 `clearCart()`를 호출한다. 다음 fixture를 쓴다.
- 매장: `storeA = { id: 'a', name: 'A', category: '카페', imageUrl: null }`, `storeB`도 같은 모양.
- 상품: `item(skuId, price, quantity)` 헬퍼. `productId`, `productName`, `skuName`은 임의 값.

| 테스트 | 단언 |
|---|---|
| 빈 장바구니에 담으면 매장과 cartId가 생긴다 | `getCartStoreId() === 'a'`, `getCartId()`가 `/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/`(uuidv7)와 일치 |
| 같은 sku를 다시 담으면 수량을 더한다 | `item('s1',1000,1)`을 담고 `item('s1',1000,2)`를 담으면 `getCartItems()`의 길이 1, 수량 3 |
| 다른 매장 상품을 담으면 기존 상품을 비우고 새 매장으로 바꾼다 | A에 s1을 담고 B에 s2를 담으면 매장 `'b'`, 상품 `['s2']` |
| 상품을 담으면 cartId가 바뀐다 | 두 번째 담기 전후의 `getCartId()`가 다름 |
| 수량을 바꾸면 cartId가 바뀐다 | `setCartItemQuantity('s1', 5)` 전후가 다름 |
| 같은 수량으로 바꾸면 cartId가 유지된다 | 수량 1에서 `setCartItemQuantity('s1', 1)`을 해도 같음 |
| 상품을 삭제하면 cartId가 바뀐다 | 상품 2개 중 1개를 `removeCartItem`하면 다름 |
| 마지막 상품을 삭제하면 장바구니가 비워진다 | `getCartStoreId()`, `getCartId()`, `getCartSummary()`가 모두 `null` |
| clearCart하면 cartId도 초기화된다 | `getCartId() === null`, `getCartItems()`는 `[]` |
| 요약은 수량 합과 금액 합을 계산한다 | `item('s1',4000,2)` + `item('s2',4500,1)`이면 `itemCount === 3`, `totalPrice === 12500` |

- [ ] **Step 4: 테스트가 실패하는지 확인한다**

Run: `yarn test src/stores/__tests__/cart.test.ts`
Expected: FAIL. `Cannot find module '../cart'`

- [ ] **Step 5: `src/stores/cart.ts`를 구현한다**

- 구조는 `auth.ts`와 같은 순서(타입 → store → hooks → getter → actions)로 쓴다.
- state는 `{ store: CartStore | null; items: CartItem[]; cartId: string | null }`이다.
- `persist(..., { name: 'cart', storage: createJSONStorage(() => AsyncStorage) })`로 저장한다.
- 내용이 실제로 바뀔 때마다 `cartId`를 새로 만든다. 생성은 `uuidv7({ rng: () => getRandomBytes(16) })`로 한다(`uuid`의 `v7`, `expo-crypto`의 `getRandomBytes`). 전역 `crypto` polyfill은 넣지 않는다.
- `addCartItem`은 매장 id가 다르면 기존 상품을 버린다. 확인창은 호출하는 쪽에서 띄운다.
- 요약은 `summarize(store, items)` 하나로 계산하고 `getCartSummary`와 `useCartSummary`가 같이 쓴다.
- `useCartSummary`는 `store`와 `items`를 따로 select한 뒤 `useMemo`로 계산한다. zustand v5에서 selector가 매번 새 객체를 반환하면 무한 렌더가 생긴다.
- `setCartItemQuantity`는 1 미만 값을 받지 않는다. 삭제는 `removeCartItem`으로 한다.

- [ ] **Step 6: 테스트가 통과하는지 확인한다**

Run: `yarn test src/stores/__tests__/cart.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 7: 커밋한다**

```bash
git add package.json yarn.lock src/stores/cart.ts src/stores/__tests__/cart.test.ts
git commit -m "add: persisted cart store"
```

---

### Task 2: logout()

**Files:**
- Create: `src/stores/session.ts`
- Create: `src/stores/__tests__/session.test.ts`
- Modify: `src/service/client.ts:7,74`

**Interfaces:**
- Consumes: `clearTokens()`(`@/stores/auth`), `addCartItem`, `clearCart`, `getCartId`(Task 1)
- Produces: `export async function logout(): Promise<void>`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`jest.mock('@/stores/auth', () => ({ clearTokens: jest.fn(() => Promise.resolve()) }))`와 Task 1의 AsyncStorage mock을 둔다.

- `logout하면 토큰과 장바구니를 비운다`: 상품 하나를 담고 `await logout()`을 호출한다. 그러면 `clearTokens`가 1번 호출되고 `getCartId()`는 `null`이어야 한다.

- [ ] **Step 2: 실패하는지 확인한다**

Run: `yarn test src/stores/__tests__/session.test.ts`
Expected: FAIL. `Cannot find module '../session'`

- [ ] **Step 3: `logout()`을 구현하고 `client.ts`가 쓰게 한다**

`logout`은 `await clearTokens()` 다음에 `clearCart()`를 호출한다. `client.ts`의 `doRefresh` catch에서 `clearTokens()`를 `logout()`으로 바꾸고 import도 정리한다. 서버 `logout(refreshToken)` mutation과 더보기 버튼 연결은 범위 밖이다.

- [ ] **Step 4: 통과하는지 확인한다**

Run: `yarn test && npx tsc --noEmit`
Expected: 모든 테스트 PASS, 타입 에러 없음

- [ ] **Step 5: 커밋한다**

```bash
git add src/stores/session.ts src/stores/__tests__/session.test.ts src/service/client.ts
git commit -m "add: logout clears tokens and cart"
```

---

### Task 3: 위치 store + 앱 시작 시 초기화

**Files:**
- Create: `src/stores/location.ts`
- Create: `src/stores/__tests__/location.test.ts`
- Modify: `src/app/index.tsx`
- Modify: `app.json` (plugins)

**Interfaces:**
- Produces:
  ```ts
  export type Coords = { latitude: number; longitude: number };
  export type LocationPermission = 'unknown' | 'granted' | 'denied';
  export function useLocationPermission(): LocationPermission;
  export function useCoords(): Coords | null;
  export function useLocationName(): string | null;
  export function useHasLocateFailed(): boolean;
  export function getLocationPermission(): LocationPermission;
  export function getCoords(): Coords | null;
  export function getLocationName(): string | null;
  export function getHasLocateFailed(): boolean;
  export async function initLocation(): Promise<void>;
  export async function refreshLocationPermission(): Promise<void>;
  ```

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`expo-location`을 mock한다. 대상은 `getForegroundPermissionsAsync`, `requestForegroundPermissionsAsync`, `getCurrentPositionAsync`, `getLastKnownPositionAsync`, `reverseGeocodeAsync`, `Accuracy: { Balanced: 3 }`이다. 모듈 수준 상태 때문에 `beforeEach`에서 `jest.resetModules()`를 호출하고 `require('../location')`로 새로 불러온다. 기본 mock 값은 다음과 같다.
- 위치: `{ coords: { latitude: 37.5, longitude: 127.03 } }`
- 주소: `[{ district: '역삼동', subregion: '강남구', city: '서울' }]`

| 테스트 | 단언 |
|---|---|
| 권한을 물어본 적 없으면 init 때 팝업을 요청한다 | 상태 `undetermined`, 요청 결과 `granted`이면 `request` 1회, `getCoords()`가 위 좌표, `getLocationName() === '역삼동'` |
| 이미 거부했으면 init 때 팝업을 요청하지 않는다 | 상태 `denied`이면 `request` 0회, `getLocationPermission() === 'denied'`, `getCoords() === null` |
| refresh는 팝업을 요청하지 않는다 | 상태 `undetermined`와 `denied` 각각에서 `refreshLocationPermission()`을 해도 `request` 0회. `undetermined`이면 `'unknown'` |
| init을 두 번 호출해도 좌표는 한 번만 가져온다 | `getCurrentPositionAsync` 1회 |
| init과 refresh가 동시에 실행돼도 좌표는 한 번만 가져온다 | `Promise.all([initLocation(), refreshLocationPermission()])` 후 `getCurrentPositionAsync` 1회 |
| 좌표가 있으면 refresh 때 좌표를 다시 가져오지 않는다 | init 후 refresh를 하면 `getCurrentPositionAsync` 1회 |
| 시작 때 거부였다가 refresh 때 허용이면 그때 좌표를 가져온다 | `denied`로 init하고, `granted`로 바꾼 뒤 refresh하면 `getCoords()`가 채워짐 |
| 권한이 꺼지면 좌표가 있어도 denied가 된다 | 허용으로 init하고 `denied`로 refresh하면 `'denied'`. 좌표는 그대로 유지 |
| 현재 위치를 못 가져오면 마지막 위치로 대체한다 | `getCurrentPositionAsync` reject, `getLastKnownPositionAsync`가 좌표 반환이면 `getCoords()`가 그 좌표 |
| 둘 다 실패하면 실패 상태가 되고 다음 refresh 때 다시 시도한다 | 첫 시도 후 `getHasLocateFailed() === true`. 다음 refresh에서 성공하면 `false`이고 좌표가 채워짐 |
| 동이 없으면 구, 시 순서로 이름을 고른다 | `district: null`이면 `'강남구'`, 둘 다 `null`이면 `'서울'` |
| 주소를 못 구하면 현재 위치라고 표시한다 | `reverseGeocodeAsync` reject 또는 `[]`이면 `'현재 위치'` |

- [ ] **Step 2: 실패하는지 확인한다**

Run: `yarn test src/stores/__tests__/location.test.ts`
Expected: FAIL. `Cannot find module '../location'`

- [ ] **Step 3: `src/stores/location.ts`를 구현한다**

- state는 `{ permission, coords, locationName, hasLocateFailed }`이다. persist는 하지 않는다.
- 권한 상태는 `granted → 'granted'`, `denied → 'denied'`, `undetermined → 'unknown'`으로 바꾼다. `unknown`을 거부로 보지 않아야 init 팝업이 떠 있는 동안 권한 꺼짐 안내가 깜빡이지 않는다.
- `initLocation`은 모듈 수준 promise로 실행당 한 번만 돈다.
- 좌표 가져오기는 내부 함수 하나로 처리한다.
  - 진행 중 promise를 공유해서 동시 호출을 하나로 합친다.
  - 좌표가 이미 있으면 바로 끝낸다.
  - 순서: `getCurrentPositionAsync({ accuracy: Accuracy.Balanced })` → 실패하면 `getLastKnownPositionAsync()` → 그래도 `null`이면 `hasLocateFailed: true`.
- `refreshLocationPermission`은 상태만 읽는다. `granted`이고 좌표가 없으면 좌표 가져오기를 호출한다.
- 동 이름은 `district ?? subregion ?? city`로 고르고, 없거나 실패하면 `'현재 위치'`로 한다.

- [ ] **Step 4: 통과하는지 확인한다**

Run: `yarn test src/stores/__tests__/location.test.ts`
Expected: PASS (12 tests)

- [ ] **Step 5: 앱 시작에 연결한다**

- `src/app/index.tsx`의 기존 `useEffect`에서 `hydrateAuth()` 옆에 `initLocation()`을 호출한다. await하지 않아서 `Redirect`와 `SplashScreen.hide`를 늦추지 않는다.
- `app.json` plugins에 다음을 추가한다.

```json
["expo-location", { "locationWhenInUsePermission": "가까운 매장을 보여드리기 위해 위치 정보를 사용해요." }]
```

- [ ] **Step 6: 확인한다**

Run: `npx tsc --noEmit && yarn lint`
Expected: 에러 없음

- [ ] **Step 7: 커밋한다**

```bash
git add src/stores/location.ts src/stores/__tests__/location.test.ts src/app/index.tsx app.json
git commit -m "add: location store with one-time permission prompt"
```

---

### Task 4: 홈 쿼리와 타입

**Files:**
- Modify: `src/graphql/queries.ts`, `src/graphql/__generated__/*` (codegen 결과)
- Modify: `src/service/api.ts`, `src/tanstack/queries.ts`, `src/tanstack/hooks.ts`
- Modify: `src/components/(tabs)/home/{CartBar,StoreThumbnail,StoreRow,NewStoreCard,PromotionCarousel}.tsx` (타입 import만)

**Interfaces:**
- Consumes: `Coords`(Task 3)
- Produces:
  ```ts
  // src/tanstack/hooks.ts
  export function useCurrentUser(): UseQueryResult<{ id: string; name: string }>;
  export function usePromotions(): UseQueryResult<Promotion[]>;
  export function useNearbyStores(coords: Coords | null): UseQueryResult<Store[]>; // coords가 null이면 enabled: false
  export function useNewStores(): UseQueryResult<Store[]>;
  ```
  query key: `['currentUser']`, `['promotions']`, `['stores', latitude, longitude]`, `['newStores']`

- [ ] **Step 1: document를 추가하고 codegen을 실행한다**

`queries.ts`에 기존 `healthCheck`와 같은 형식으로 `currentUser`(id, name), `promotions`(id, title, description, imageUrl), `stores($latitude: Float!, $longitude: Float!, $size: Int)`, `newStores($size: Int)`를 추가한다. 매장 쿼리 두 개는 `items`에서 `Store`의 모든 필드를 선택한다. fragment는 쓰지 않는다. client preset의 fragment masking 때문이다.

Run: `yarn codegen`
Expected: `src/graphql/__generated__/graphql.ts`에 `StoresQuery`, `NewStoresQuery` 등이 생김

- [ ] **Step 2: API 메서드, query 함수, 훅을 추가한다**

- `API`: `currentUser()`, `promotions()`, `stores(latitude, longitude, size)`, `newStores(size)`. 반환 값은 기존처럼 `.then((res) => res.xxx)`로 꺼낸다. 매장은 `.items`까지 꺼낸다.
- `src/tanstack/queries.ts`: `getCurrentUser`, `getPromotions`, `getNearbyStores(coords)`, `getNewStores()`.
  - 크기 상수: `NEARBY_STORE_SIZE = 5`, `NEW_STORE_SIZE = 10`.
  - 반경은 서버 기본값 5km를 쓴다.
  - 기존 `getOrders` mock은 그대로 둔다.
- `src/tanstack/hooks.ts`: 위 Interfaces의 훅 4개.

- [ ] **Step 3: 컴포넌트 타입을 codegen 타입으로 바꾼다**

5개 컴포넌트의 `import type { Store | Promotion } from '@/components/(tabs)/home/mock'`을 `'@/graphql/__generated__/graphql'`로 바꾼다. `mock.ts`는 Task 5에서 지운다.

- [ ] **Step 4: 확인한다**

Run: `npx tsc --noEmit && yarn lint && yarn test`
Expected: 에러 없음, 테스트 PASS

- [ ] **Step 5: 커밋한다**

```bash
git add src/graphql src/service/api.ts src/tanstack "src/components/(tabs)/home"
git commit -m "add: home queries"
```

---

### Task 5: 홈 화면 연결

**Files:**
- Modify: `src/app/(tabs)/home/index.tsx`
- Delete: `src/components/(tabs)/home/mock.ts`

**Interfaces:**
- Consumes: Task 1 `useCartSummary`, Task 3 `useLocationPermission`/`useCoords`/`useLocationName`/`useHasLocateFailed`/`refreshLocationPermission`, Task 4 훅 4개

- [ ] **Step 1: `MOCK_HOME`을 실제 값으로 교체한다**

- `isLocationGranted = permission === 'granted'`
- 인사말에는 `currentUser.data.name`, 상단 동 이름에는 `useLocationName()`을 쓴다.
- `isLoading`은 `currentUser`, `promotions`, `newStores` 중 하나라도 `isPending`이면 `true`이다. `stores`는 포함하지 않는다.
- 가까운 매장 섹션은 권한이 있을 때 다음 순서로 분기한다.
  1. `hasLocateFailed`이고 좌표가 없으면 `SectionNotice`를 보여준다. title `"현재 위치를 확인할 수 없어요"`, message `"기기의 위치 서비스가 켜져 있는지 확인해주세요."`, 버튼은 기존 검색 버튼과 같다.
  2. 그 외 로딩 중이면 표시 방식은 빌더가 정한다.
  3. 결과가 오면 기존 목록이나 빈 목록 안내를 보여준다.
- `isError`는 4개 쿼리 중 하나라도 `isError`이면 `true`이다. `handleRetry`는 `isError`인 쿼리만 `refetch()`한다.
- 장바구니 바에는 `useCartSummary()`를 쓴다. null이면 숨긴다.
- 진행 중 주문 바는 `MOCK_ORDERS` 그대로 둔다.

- [ ] **Step 2: 홈에서 권한을 다시 확인한다**

`expo-router`의 `useFocusEffect(useCallback(...))` 안에서 다음을 한다.
- `refreshLocationPermission()`을 호출한다.
- `AppState.addEventListener('change', ...)`를 등록한다. 상태가 `'active'`이면 `refreshLocationPermission()`을 호출한다.
- cleanup에서 `subscription.remove()`를 호출한다.

리스너 콜백 이름은 `handleAppStateChange`로 한다.

- [ ] **Step 3: mock을 지우고 확인한다**

`src/components/(tabs)/home/mock.ts`를 삭제한다.

Run: `npx tsc --noEmit && yarn lint && yarn test`
Expected: 에러 없음, 테스트 PASS

- [ ] **Step 4: 실기기에서 확인한다**

`expo-location` plugin이 추가돼서 네이티브를 다시 만들어야 한다. `npx expo prebuild --clean` 후 `yarn ios` 또는 `yarn android`를 실행하고 아래를 확인한다.

1. 첫 실행 시 위치 팝업이 한 번 뜨고, 허용하면 동 이름과 가까운 매장이 나온다.
2. 앱을 다시 켜면 팝업이 뜨지 않는다.
3. 설정에서 권한을 끄고 앱으로 돌아오면 탭 이동 없이 "위치 권한이 꺼져 있어요"가 나온다. 주문내역 → 홈으로 이동해도 팝업은 뜨지 않는다.
4. "설정에서 켜기"로 권한을 켜고 돌아오면 가까운 매장이 나온다.
5. 홈 탭을 여러 번 오가도 매장 목록 요청이 다시 나가지 않는다. query key가 같은지 확인한다.
6. 네트워크를 끊고 실행하면 `AlertModal`이 뜨고, 다시 연결한 뒤 "다시 시도"를 누르면 복구된다.
7. 장바구니에 담는 UI가 아직 없으므로 임시 확인을 한다.
   - 홈 진입 시 `addCartItem`을 한 번 호출하는 코드를 임시로 넣는다.
   - 에러 없이 `CartBar`가 나오는지 확인한다. jest는 Node `crypto`가 있어 잡지 못하는, `uuid`의 전역 `crypto` 의존 여부를 여기서 확인한다.
   - 앱을 완전히 껐다 켜도 `CartBar`가 남는지 확인한다.
   - 확인이 끝나면 임시 코드를 되돌린다.

- [ ] **Step 5: graph를 갱신하고 커밋한다**

```bash
graphify update .
git add "src/app/(tabs)/home/index.tsx" "src/components/(tabs)/home/mock.ts"
git commit -m "add: connect home to api"
```
