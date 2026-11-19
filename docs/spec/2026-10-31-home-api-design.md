# Home API 연동 설계

작성일: 2026-10-31

## 목표

홈 화면(`src/app/(tabs)/home/index.tsx`)의 `MOCK_HOME`을 실제 데이터로 교체한다.

- 인사말: `currentUser.name`
- 프로모션: `promotions`
- 가까운 매장: 앱 실행 시 고정한 좌표로 `stores(latitude, longitude)`
- 새로 들어왔어요: `newStores`
- 동네 이름("역삼동"): `expo-location`의 `reverseGeocodeAsync`
- 장바구니 바: 기기에 저장되는 zustand 장바구니 store

장바구니를 서버에 저장하지 않는 이유: 기기 간 동기화가 필요 없다. 앱을 껐다 켜도 남아 있기만 하면 된다.

## 범위 밖

- 진행 중 주문 바(`LiveOrderBar`): 주문내역 API 작업 때 함께 바꾼다. 이번에는 `MOCK_ORDERS`를 그대로 쓴다.
- "전체보기" 화면: 이동할 화면이 아직 없다.
- "역삼동 ⌄"를 눌러 위치를 직접 바꾸는 기능
- 검색 화면
- 장바구니에 담기, 수량 변경, 삭제를 실제로 호출하는 UI: 매장 상세와 장바구니 화면 작업 때 붙인다. 이번에는 store에 액션만 만든다.
- 담아둔 상품의 품절이나 가격 변경 처리: 주문 직전 서버 검증의 영역이다.

## 하지 말아야 할 것

- 위치 권한 팝업을 두 번 이상 띄우지 않는다. 사용자가 설정에서 직접 권한을 껐는데 앱이 계속 물어보면 불쾌감을 준다.
- 사용자가 움직일 때마다 좌표를 다시 가져오거나 매장 목록을 다시 부르지 않는다. 좌표는 앱 실행 시 한 번 정하고 고정한다.

## 위치

### 권한 요청: 앱 첫 실행 직후 한 번만

- `src/app/index.tsx`에서 auth hydrate와 함께 위치 초기화를 시작한다. 로그인 여부와는 상관없다.
- 권한 상태를 먼저 읽는다(`getForegroundPermissionsAsync`). 상태가 `undetermined`일 때만 `requestForegroundPermissionsAsync`를 호출한다. expo는 Android에서도 요청 이력을 기록해서 한 번도 묻지 않은 상태를 `undetermined`로 돌려준다. 따라서 이미 물어봤거나 사용자가 직접 끈 경우는 `denied`가 되어 팝업이 다시 뜨지 않는다. 별도 플래그를 저장할 필요는 없다.
- 위치 초기화를 기다리느라 화면 이동(Redirect)이나 스플래시 숨김을 늦추지 않는다.
- (작성자 판단) iOS에서 "한 번 허용"을 고르면 다음 실행 때 상태가 다시 `undetermined`가 되어 팝업이 또 뜬다. 사용자가 매번 묻기를 고른 것이라 OS 동작대로 둔다. Android "이번만 허용"은 다음 실행 때 `denied`가 되어 팝업 없이 권한 꺼짐 안내가 나온다. 이 플랫폼 차이도 그대로 둔다.

### 좌표: 실행당 한 번 고정

- 권한이 있으면 `getCurrentPositionAsync`로 좌표를 한 번 가져온다. 이후 이 좌표를 바꾸지 않는다.
- 좌표와 동네 이름은 메모리 zustand store(`src/stores/location.ts`)에 둔다. persist는 하지 않는다. 다음 실행 때는 새 좌표를 받는다.
- 예외: 실행 시 권한이 없어서 좌표가 없었는데, 나중에 사용자가 권한을 켜고 돌아온 경우. 이때 좌표를 한 번 가져와서 고정한다. 앱을 다시 켤 때까지 매장 목록이 비어 있는 것을 막기 위해서다.
- (작성자 판단) 권한은 있는데 좌표를 못 가져온 경우(OS 위치 서비스 꺼짐, 측위 시간 초과 등):
  - 먼저 `getLastKnownPositionAsync`로 대체한다.
  - 그래도 없으면 실패한 시도는 "한 번"으로 치지 않는다. 다음 홈 focus나 포그라운드 복귀 때 다시 시도한다.
  - 그동안 "가까운 매장" 자리에 "현재 위치를 확인할 수 없어요" 안내(`SectionNotice`)를 보여준다. 권한 꺼짐 안내는 사실과 다르므로 쓰지 않는다. 로딩 상태로 계속 남겨 두지 않는다.
- 좌표를 받으면 `reverseGeocodeAsync`로 동네 이름을 구한다. 홈 상단에는 지금 UI처럼 동 이름만 보여준다(예: "역삼동").

### 홈에서 권한 다시 확인

사용자가 앱 사용 중 설정에서 권한을 끄거나 켤 수 있다. 홈은 다음 두 시점에 권한 상태를 확인한다. 이때 팝업은 띄우지 않고 상태만 읽는다.

1. 탭 이동으로 홈이 focus될 때: `useFocusEffect`
2. 홈이 보이는 상태에서 앱이 백그라운드에서 포그라운드로 돌아올 때: `useFocusEffect` 안에서 `AppState`의 `change` 리스너를 등록하고 blur 때 해제한다. "설정에서 켜기"를 누르고 돌아오는 경우가 여기에 해당한다. 이 경우는 화면 이동이 없어서 focus 이벤트만으로는 잡히지 않는다.

권한이 있고 좌표가 없으면 위의 예외 규칙대로 좌표를 한 번 가져온다. 권한이 없으면 지금의 "위치 권한이 꺼져 있어요" 안내를 보여준다.

### app.json

`expo-location`은 설치만 되어 있다(`~57.0.22`). `app.json` plugins에 `expo-location`을 추가하고 iOS 권한 문구(`locationWhenInUsePermission`)를 한국어로 넣는다. 백그라운드 위치는 쓰지 않는다. 네이티브 모듈이라 dev build를 다시 빌드해야 한다.

## 장바구니

`src/stores/cart.ts`. `src/stores/auth.ts`와 같은 구조로 만든다: store, hooks, getter, actions.

- `persist` + `createJSONStorage(() => AsyncStorage)`로 저장한다. 민감 정보가 아니라서 SecureStore는 쓰지 않는다. AsyncStorage는 이미 설치되어 있다.
- 장바구니 하나에는 매장 하나의 상품만 담는다(PRD 4.8). 다른 매장 상품을 담을 때 띄우는 "기존 메뉴를 비우고 새 매장의 메뉴를 담을까요?" 확인창은 매장 상세 화면에서 만든다. store는 현재 장바구니의 매장을 알려주는 getter만 제공한다.
- 상태:
  - `store`: 매장 정보. `CartBar`가 매장 이름을 보여줘야 해서 함께 저장한다.
  - `items`: `OrderItemInput`과 같은 모양(`productId`, `productName`, `skuId`, `skuName`, `price`, `quantity`). 주문할 때 변환 없이 `createOrder`에 넘긴다.
  - `cartId`
- 개수와 총액은 저장하지 않는다. `items`에서 계산한다. 저장하면 값이 어긋날 수 있다.
- 액션: 담기, 수량 변경, 삭제, 비우기.
- 로그아웃하거나 세션이 끊기면 장바구니를 비운다. 장바구니는 계정과 묶여 있지 않아서, 비우지 않으면 다른 계정으로 로그인했을 때 이전 사용자의 장바구니가 보이고 주문까지 이어질 수 있다. `clearTokens()`는 토큰만 지우는 함수라서 장바구니 비우기를 넣지 않는다. 대신 `src/stores/session.ts`에 `logout()`을 새로 만든다. `logout()`은 `clearTokens()`와 장바구니 비우기를 함께 호출한다. 이 파일을 따로 두는 이유는 auth store가 장바구니 store를 import하지 않게 하기 위해서다. 로그아웃 경로는 모두 `logout()`을 부른다.
  - `src/service/client.ts`: refresh token이 거부될 때 `clearTokens()` 대신 `logout()`을 호출한다.
  - 더보기 화면의 로그아웃 버튼: 아직 TODO다. 버튼을 만들 때 `logout()`을 호출한다.

### cartId (멱등키)

`cartId`는 `createOrder`의 멱등키다. 요청이 여러 번 가도 서버가 한 번만 처리한다.

- 장바구니를 새로 만들 때 생성한다.
- 주문 요청이 실패하거나 응답이 없어서 재시도할 때는 같은 `cartId`를 보낸다.
- 장바구니 내용이 바뀌면 새로 생성한다. 첫 요청이 실제로는 처리됐는데 응답만 못 받은 상태에서 사용자가 상품을 바꾸고 다시 주문하면, 이전 `cartId`로는 서버가 중복 요청으로 보고 새 주문을 무시할 수 있다.
- 주문이 성공하면 장바구니를 비우면서 함께 초기화한다.

## 홈 데이터

### 구조

기존 auth 연동과 같은 흐름을 따른다.

| 파일 | 역할 |
|---|---|
| `src/graphql/queries.ts` | `currentUser`, `promotions`, `stores`, `newStores` document 추가 후 `yarn codegen` |
| `src/service/api.ts` | 쿼리별 메서드 |
| `src/tanstack/queries.ts` | `API.xxx` 호출 함수 |
| `src/tanstack/hooks.ts` | 쿼리 훅 |
| `src/stores/location.ts` | 권한 상태, 고정 좌표, 동네 이름 |
| `src/stores/cart.ts` | 장바구니 |
| `src/stores/session.ts` | `logout()`: `clearTokens()` + 장바구니 비우기 |
| `src/service/client.ts` | refresh token 거부 시 `clearTokens()` 대신 `logout()` |
| `src/app/index.tsx` | 위치 초기화 시작 |
| `src/app/(tabs)/home/index.tsx` | `MOCK_HOME` 제거, 쿼리와 store 연결, 권한 재확인 |
| `src/components/(tabs)/home/mock.ts` | `Store`, `Promotion` 타입을 codegen 타입으로 교체. 쓰지 않게 된 mock 제거 |
| `app.json` | `expo-location` plugin |

### 쿼리

- `stores`: 좌표가 있을 때만 실행한다(`enabled`). query key에 고정 좌표를 넣는다. 반경은 기본값 5km. 홈에는 5개만 보여준다(`size: 5`).
- `newStores`: 첫 페이지만 쓴다. 위치와 상관없다.
- `promotions`, `currentUser`: 위치와 상관없다.

### 로딩과 에러

- `currentUser`, `promotions`, `newStores`가 모두 올 때까지 `HomeSkeleton`을 보여준다. 이 셋은 위치와 상관없어서 바로 시작한다.
- 가까운 매장은 따로 받는다. 좌표나 `stores` 응답을 기다리는 동안 전체 화면을 스켈레톤으로 막지 않는다.
- 쿼리 하나라도 실패하면 기존 `AlertModal`을 띄운다. "다시 시도"는 실패한 쿼리만 다시 부른다.

## 빌더에게 맡기는 것

- 위치·장바구니 store의 함수 이름과 세부 시그니처
- 가까운 매장이 로딩 중일 때 섹션 표시 방식(빈 공간, 행 스켈레톤 등)
- `reverseGeocodeAsync` 결과에서 동 이름을 고르는 필드 순서와 실패 시 대체 문구
- `newStores`의 `size`
