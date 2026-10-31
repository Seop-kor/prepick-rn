# Graph Report - prepick-rn  (2026-10-31)

## Corpus Check
- 82 files · ~80,858 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .otf 9, (none) 4, .graphify-bak 1)

## Summary
- 703 nodes · 1243 edges · 54 communities (44 shown, 10 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6050a788`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- dependencies
- expo
- What You Must Do When Invoked
- WelcomeScreen
- client.ts
- smart-order-consumer-app-PRD.md
- devDependencies
- graphify reference: extra exports and benchmark
- PromotionCarousel.tsx
- tsconfig.json
- Welcome to your Expo app 👋
- AGENTS.md
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- CLAUDE.md
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- .claude/CLAUDE.md
- extraction-spec.md
- 2.1 포함 기능
- signup/index.tsx
- 4.2 회원가입 화면
- 4.3 홈
- 5. 주요 사용자 흐름
- 7. 백엔드 기능 범위
- 8. 필요한 API 목록
- 4.6 매장 상세
- 4.8 장바구니
- 4.11 주문내역
- 4.7 메뉴 상세
- color.ts
- hooks.ts
- cart.ts
- home/index.tsx
- StoreThumbnail.tsx
- scripts
- [id].tsx
- orders/index.tsx
- @rneui/themed
- eslint.config.js
- codegen.ts
- (tabs)/_layout.tsx
- TermsBottomSheet
- location.ts
- api.ts
- login/index.tsx
- react-native
- Home API 연동 설계
- jest
- MoreScreen

## God Nodes (most connected - your core abstractions)
1. `instance` - 32 edges
2. `react-native` - 28 edges
3. `@rneui/themed` - 26 edges
4. `SignupScreen()` - 25 edges
5. `expo-router` - 19 edges
6. `HomeScreen()` - 17 edges
7. `Task 5: 홈 화면 연결` - 16 edges
8. `react` - 15 edges
9. `requestGraphQL()` - 14 edges
10. `expo` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Task 3: 위치 store + 앱 시작 시 초기화` --references--> `getCoords()`  [INFERRED]
  docs/plan/2026-10-31-home-api-plan.md → src/stores/location.ts
- `Task 5: 홈 화면 연결` --references--> `CartBar()`  [INFERRED]
  docs/plan/2026-10-31-home-api-plan.md → src/components/(tabs)/home/CartBar.tsx
- `장바구니` --references--> `CartBar()`  [INFERRED]
  docs/spec/2026-10-31-home-api-design.md → src/components/(tabs)/home/CartBar.tsx
- `로딩과 에러` --references--> `HomeSkeleton()`  [INFERRED]
  docs/spec/2026-10-31-home-api-design.md → src/components/(tabs)/home/HomeSkeleton.tsx
- `Task 5: 홈 화면 연결` --references--> `SectionNotice()`  [INFERRED]
  docs/plan/2026-10-31-home-api-plan.md → src/components/(tabs)/home/SectionNotice.tsx

## Import Cycles
- None detected.

## Communities (54 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (29): main, name, private, version, expo, expo-constants, expo-dev-client, expo-device (+21 more)

### Community 1 - "dependencies"
Cohesion: 0.05
Nodes (37): dependencies, axios, date-fns, expo, expo-constants, expo-crypto, expo-dev-client, expo-device (+29 more)

### Community 2 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, reactCompiler (+17 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 5 - "client.ts"
Cohesion: 0.10
Nodes (29): Task 3: 위치 store + 앱 시작 시 초기화, axios, expo-secure-store, expo-splash-screen, @graphql-typed-document-node/core, @tanstack/react-query, zustand, IndexScreen() (+21 more)

### Community 6 - "smart-order-consumer-app-PRD.md"
Cohesion: 0.13
Nodes (14): 10. 향후 확장 가능 기능, 3. 전체 화면 구조, 4.10 주문 완료, 4.12 주문 상세, 4.13 더보기, 4.4 매장 카드, 4.5 검색 화면, 4.9 주문서 (+6 more)

### Community 7 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-expo, graphql, @graphql-codegen/cli, @graphql-codegen/client-preset, @graphql-typed-document-node/core, jest (+6 more)

### Community 8 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 9 - "PromotionCarousel.tsx"
Cohesion: 0.25
Nodes (6): expo-image, BACKGROUNDS, PromotionCarousel(), Props, styles, Promotion

### Community 10 - "tsconfig.json"
Cohesion: 0.25
Nodes (7): expo/tsconfig.base, compilerOptions, paths, strict, extends, include, @/assets/*

### Community 11 - "Welcome to your Expo app 👋"
Cohesion: 0.29
Nodes (6): Get a fresh project, Get started, Join the community, Learn more, Other setup steps, Welcome to your Expo app 👋

### Community 12 - "AGENTS.md"
Cohesion: 0.33
Nodes (5): Building with EAS, Commands, Expo has changed — do not trust your training data, Navigation & Routing, Rules

### Community 13 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 14 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 15 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 16 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 17 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): graphify, 코드 작성 시 유의사항 (중요), 테스트 파일 작성 시 유의사항 (중요)

### Community 22 - "2.1 포함 기능"
Cohesion: 0.14
Nodes (14): 1.1 제품 목표, 1.2 프로젝트 목적, 1.3 핵심 서비스 정책, 1. 제품 개요, 2.1 포함 기능, 2.2 제외 기능, 2. 제품 범위, Smart Order Consumer App PRD (+6 more)

### Community 23 - "signup/index.tsx"
Cohesion: 0.07
Nodes (32): LoginScreen(), handleChangePhone(), handleLogin(), handleLoginError(), EXPIRED_ALERT, getErrorCode(), getOtpRequestErrorMessage(), RETRY_ALERT (+24 more)

### Community 24 - "4.2 회원가입 화면"
Cohesion: 0.20
Nodes (10): 4.1 로그인 화면, 4.2 회원가입 화면, 4. 화면 및 UI 요구사항, OTP 정책, UI 구성, UI 구성, 가입 기준, 목적 (+2 more)

### Community 25 - "4.3 홈"
Cohesion: 0.29
Nodes (7): 4.3 홈, 가까운 매장, 검색, 상단 위치 영역, 신규 매장, 프로모션 배너, 화면 구조

### Community 26 - "5. 주요 사용자 흐름"
Cohesion: 0.40
Nodes (5): 5.1 신규 회원가입, 5.2 매장 탐색, 5.3 주문, 5.4 주문 확인, 5. 주요 사용자 흐름

### Community 27 - "7. 백엔드 기능 범위"
Cohesion: 0.40
Nodes (5): 7. 백엔드 기능 범위, 매장, 메뉴, 주문, 회원 / 인증

### Community 28 - "8. 필요한 API 목록"
Cohesion: 0.40
Nodes (5): 8.1 인증, 8.2 홈 / 매장, 8.3 메뉴, 8.4 주문, 8. 필요한 API 목록

### Community 29 - "4.6 매장 상세"
Cohesion: 0.50
Nodes (4): 4.6 매장 상세, 메뉴 영역, 메뉴 카드, 상단

### Community 30 - "4.8 장바구니"
Cohesion: 0.50
Nodes (4): 4.8 장바구니, UI 예시, 다른 매장 상품을 담는 경우, 주요 기능

### Community 31 - "4.11 주문내역"
Cohesion: 0.67
Nodes (3): 4.11 주문내역, 지난 주문 예시, 진행 중 주문 예시

### Community 32 - "4.7 메뉴 상세"
Cohesion: 0.67
Nodes (3): 4.7 메뉴 상세, UI 예시, 주요 기능

### Community 34 - "hooks.ts"
Cohesion: 0.08
Nodes (43): Step 2 - Detect files, Task 4: 홈 쿼리와 타입, Auth API 연동 설계, 검증, 구조, 로그인, 목표, 범위 밖 (+35 more)

### Community 35 - "cart.ts"
Cohesion: 0.11
Nodes (33): Global Constraints, Home API 연동 구현 계획, Review Focus, Task 1: 장바구니 store + 테스트 환경, Task 2: logout(), cartId (멱등키), 장바구니, ref_crypto (+25 more)

### Community 36 - "home/index.tsx"
Cohesion: 0.15
Nodes (13): expo-symbols, CHEVRON_DOWN_ICON, TODO: 검색 화면 작업 시 이동, SEARCH_ICON, styles, Props, styles, Props (+5 more)

### Community 38 - "StoreThumbnail.tsx"
Cohesion: 0.15
Nodes (17): CartBar(), Props, styles, NewStoreCard(), Props, styles, Props, StoreRow() (+9 more)

### Community 39 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, codegen, format, ios, lint, reset-project, start (+2 more)

### Community 40 - "[id].tsx"
Cohesion: 0.08
Nodes (25): date-fns, OrderDetailScreen(), TODO: API 연결 시 order(id) 쿼리로 교체, TODO: 매장 상세 화면 작업 시 order.storeId로 이동, styles, item(), minutesAgo(), MOCK_ORDERS (+17 more)

### Community 41 - "orders/index.tsx"
Cohesion: 0.14
Nodes (13): lodash, formatDay(), OrdersScreen(), styles, Skeleton(), SkeletonBlock(), styles, HomeSkeleton() (+5 more)

### Community 42 - "@rneui/themed"
Cohesion: 0.18
Nodes (10): react-native-reanimated, @rneui/themed, TODO: 로그아웃 API 연결, styles, AlertModal(), Props, styles, Props (+2 more)

### Community 43 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, eslint, eslint-config-expo

### Community 45 - "(tabs)/_layout.tsx"
Cohesion: 0.53
Nodes (5): HomeIcon(), MoreIcon(), OrdersIcon(), TabIconProps, TabsLayout()

### Community 47 - "location.ts"
Cohesion: 0.10
Nodes (22): Task 5: 홈 화면 연결, expo-location, ref_jest_globals, HomeScreen(), handleAppStateChange(), isLiveOrder(), applyPermission(), getCoords() (+14 more)

### Community 48 - "api.ts"
Cohesion: 0.18
Nodes (15): src_graphql_generated_graphql, src_graphql_generated_graphql_promotionsquery, src_graphql_generated_graphql_storesquery, src_graphql_generated_index, src_graphql_generated_index_graphql, login, refreshSession, sendSignupOtp (+7 more)

### Community 49 - "login/index.tsx"
Cohesion: 0.20
Nodes (10): expo-router, react, styles, AuthForm(), Props, styles, useKeyboardVisible(), FocusEvent (+2 more)

### Community 50 - "react-native"
Cohesion: 0.18
Nodes (9): expo-status-bar, react-native, react-native-safe-area-context, styles, TermsDetailModal(), TODO: 약관동의 API 연동 (SignUpInput에 동의 필드가 없어 현재는 UI만 존재), styles, TERMS (+1 more)

### Community 51 - "Home API 연동 설계"
Cohesion: 0.17
Nodes (10): app.json, Home API 연동 설계, 권한 요청: 앱 첫 실행 직후 한 번만, 범위 밖, 빌더에게 맡기는 것, 위치, 좌표: 실행당 한 번 고정, 하지 말아야 할 것 (+2 more)

### Community 52 - "jest"
Cohesion: 0.50
Nodes (4): jest, moduleNameMapper, preset, transformIgnorePatterns

## Knowledge Gaps
- **305 isolated node(s):** `storeA`, `storeB`, `name`, `slug`, `version` (+300 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 380 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `expo-router` connect `login/index.tsx` to `package.json`, `color.ts`, `home/index.tsx`, `client.ts`, `[id].tsx`, `orders/index.tsx`, `(tabs)/_layout.tsx`, `react-native`, `signup/index.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `GraphQLError` connect `client.ts` to `login/index.tsx`, `hooks.ts`, `signup/index.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `SignupScreen()` (e.g. with `handleRequestCode()` and `handleSignup()`) actually correct?**
  _`SignupScreen()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `storeA`, `storeB`, `name` to the rest of the system?**
  _305 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._