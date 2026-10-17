# Graph Report - prepick-rn  (2026-10-17)

## Corpus Check
- 52 files · ~69,623 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .otf 9, (none) 4, .graphify-bak 1)

## Summary
- 464 nodes · 648 edges · 39 communities (30 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7da7d04b`
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
- scripts
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
- home.tsx
- client.ts
- SignupScreen
- TermsBottomSheet

## God Nodes (most connected - your core abstractions)
1. `SignupScreen()` - 25 edges
2. `expo` - 13 edges
3. `@rneui/themed` - 12 edges
4. `instance` - 12 edges
5. `What You Must Do When Invoked` - 12 edges
6. `expo-router` - 11 edges
7. `react-native` - 11 edges
8. `LoginScreen()` - 11 edges
9. `setTokens()` - 11 edges
10. `requestGraphQL()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `로그인` --references--> `setTokens()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/stores/auth.ts
- `회원가입` --references--> `setTokens()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/stores/auth.ts
- `구조` --references--> `GraphQLError`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/service/client.ts
- `구조` --references--> `setTokens()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/stores/auth.ts
- `구조` --references--> `useLogin()`  [INFERRED]
  docs/spec/2026-10-10-auth-api-design.md → src/tanstack/hooks.ts

## Import Cycles
- None detected.

## Communities (39 total, 9 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (38): config, { defineConfig }, expoConfig, main, name, private, version, date-fns (+30 more)

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
Cohesion: 0.19
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

### Community 9 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, android, codegen, format, ios, lint, reset-project, start (+1 more)

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
Nodes (39): expo-router, react, react-native, react-native-reanimated, react-native-safe-area-context, @rneui/themed, styles, styles (+31 more)

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

### Community 34 - "client.ts"
Cohesion: 0.06
Nodes (48): Step 2 - Detect files, Auth API 연동 설계, 검증, 구조, 로그인, 목표, 범위 밖, 에러 처리 (+40 more)

### Community 35 - "SignupScreen"
Cohesion: 0.12
Nodes (20): LoginScreen(), handleChangePhone(), handleLogin(), handleLoginError(), getErrorCode(), getOtpRequestErrorMessage(), SignupScreen(), handleChangeCode() (+12 more)

## Knowledge Gaps
- **249 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 289 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `GraphQLError` connect `client.ts` to `signup/index.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `Step 2 - Detect files` connect `client.ts` to `What You Must Do When Invoked`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `SignupScreen()` (e.g. with `handleRequestCode()` and `handleSignup()`) actually correct?**
  _`SignupScreen()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _249 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._