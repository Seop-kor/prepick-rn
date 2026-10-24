# Graph Report - prepick-rn  (2026-10-24)

## Corpus Check
- 75 files · ~75,459 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .otf 9, (none) 4, .graphify-bak 1)

## Summary
- 593 nodes · 960 edges · 47 communities (39 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `696a2dcc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- dependencies
- expo
- What You Must Do When Invoked
- WelcomeScreen
- auth.ts
- smart-order-consumer-app-PRD.md
- devDependencies
- graphify reference: extra exports and benchmark
- StoreThumbnail.tsx
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
- client.ts
- SignupScreen
- home/index.tsx
- NewStoreCard.tsx
- scripts
- [id].tsx
- orders/index.tsx
- react-native
- eslint.config.js
- codegen.ts
- (tabs)/_layout.tsx
- TermsBottomSheet

## God Nodes (most connected - your core abstractions)
1. `instance` - 32 edges
2. `react-native` - 28 edges
3. `@rneui/themed` - 26 edges
4. `SignupScreen()` - 25 edges
5. `expo-router` - 18 edges
6. `react` - 14 edges
7. `expo` - 13 edges
8. `What You Must Do When Invoked` - 12 edges
9. `react-native-safe-area-context` - 11 edges
10. `LoginScreen()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `로그인` --references--> `setTokens()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/stores/auth.ts
- `회원가입` --references--> `setTokens()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/stores/auth.ts
- `구조` --references--> `toDigits()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/utils/phone.ts
- `구조` --references--> `GraphQLError`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/service/client.ts
- `구조` --references--> `setTokens()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/stores/auth.ts

## Import Cycles
- None detected.

## Communities (47 total, 8 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.08
Nodes (25): main, name, private, version, expo, expo-dev-client, expo-device, expo-font (+17 more)

### Community 1 - "dependencies"
Cohesion: 0.06
Nodes (34): dependencies, axios, date-fns, expo, expo-constants, expo-dev-client, expo-device, expo-font (+26 more)

### Community 2 - "expo"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, reactCompiler (+17 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 5 - "auth.ts"
Cohesion: 0.20
Nodes (14): expo-secure-store, expo-splash-screen, @tanstack/react-query, zustand, IndexScreen(), queryClient, RootLayout(), AuthState (+6 more)

### Community 6 - "smart-order-consumer-app-PRD.md"
Cohesion: 0.13
Nodes (14): 10. 향후 확장 가능 기능, 3. 전체 화면 구조, 4.10 주문 완료, 4.12 주문 상세, 4.13 더보기, 4.4 매장 카드, 4.5 검색 화면, 4.9 주문서 (+6 more)

### Community 7 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-expo, graphql, @graphql-codegen/cli, @graphql-codegen/client-preset, @graphql-typed-document-node/core, prettier (+3 more)

### Community 8 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 9 - "StoreThumbnail.tsx"
Cohesion: 0.11
Nodes (18): expo-image, CartBar(), Props, styles, daysAgo(), MOCK_HOME, Promotion, TODO: API 연결 시 codegen 타입과 쿼리 결과로 교체 (+10 more)

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
Cohesion: 0.06
Nodes (33): expo-constants, react, react-native-screens, LoginScreen(), handleChangePhone(), handleLogin(), handleLoginError(), styles (+25 more)

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

### Community 33 - "color.ts"
Cohesion: 0.17
Nodes (8): expo-router, expo-status-bar, TODO: 약관동의 API 연동 (SignUpInput에 동의 필드가 없어 현재는 UI만 존재), styles, TERMS, styles, Colors, instance

### Community 34 - "client.ts"
Cohesion: 0.06
Nodes (46): Step 2 - Detect files, Auth API 연동 설계, 검증, 구조, 로그인, 목표, 범위 밖, 에러 처리 (+38 more)

### Community 35 - "SignupScreen"
Cohesion: 0.21
Nodes (14): getErrorCode(), getOtpRequestErrorMessage(), SignupScreen(), handleChangeCode(), handleRequestCode(), handleResendCode(), handleSendOtpError(), handleSendOtpSuccess() (+6 more)

### Community 36 - "home/index.tsx"
Cohesion: 0.16
Nodes (13): expo-symbols, CHEVRON_DOWN_ICON, TODO: API 연결 시 쿼리 결과와 expo-location으로 교체, TODO: 검색 화면 작업 시 이동, TODO: API 연결 시 실패한 쿼리만 refetch, SEARCH_ICON, styles, Props (+5 more)

### Community 38 - "NewStoreCard.tsx"
Cohesion: 0.29
Nodes (8): NewStoreCard(), Props, styles, Props, StoreRow(), styles, formatDistance(), toWalkingMinutes()

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, android, codegen, format, ios, lint, reset-project, start (+1 more)

### Community 40 - "[id].tsx"
Cohesion: 0.06
Nodes (29): date-fns, HomeScreen(), OrderDetailScreen(), TODO: API 연결 시 order(id) 쿼리로 교체, TODO: 매장 상세 화면 작업 시 order.storeId로 이동, styles, LiveOrderBar(), Props (+21 more)

### Community 41 - "orders/index.tsx"
Cohesion: 0.11
Nodes (15): lodash, formatDay(), OrdersScreen(), styles, Skeleton(), SkeletonBlock(), styles, HomeSkeleton() (+7 more)

### Community 42 - "react-native"
Cohesion: 0.13
Nodes (14): react-native, react-native-reanimated, react-native-safe-area-context, @rneui/themed, styles, TermsDetailModal(), Props, styles (+6 more)

### Community 43 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, eslint, eslint-config-expo

### Community 45 - "(tabs)/_layout.tsx"
Cohesion: 0.53
Nodes (5): HomeIcon(), MoreIcon(), OrdersIcon(), TabIconProps, TabsLayout()

## Knowledge Gaps
- **280 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+275 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 347 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `react-native` connect `react-native` to `package.json`, `color.ts`, `home/index.tsx`, `NewStoreCard.tsx`, `[id].tsx`, `orders/index.tsx`, `StoreThumbnail.tsx`, `(tabs)/_layout.tsx`, `signup/index.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `GraphQLError` connect `client.ts` to `signup/index.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `SignupScreen()` (e.g. with `handleRequestCode()` and `handleSignup()`) actually correct?**
  _`SignupScreen()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _280 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._