# Graph Report - prepick-rn  (2026-10-05)

## Corpus Check
- 36 files · ~63,191 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .otf 9, (none) 3, .graphify-bak 1)

## Summary
- 268 nodes · 298 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edf65ee5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- dependencies
- expo
- What You Must Do When Invoked
- client.ts
- app/_layout.tsx
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

## God Nodes (most connected - your core abstractions)
1. `expo` - 13 edges
2. `What You Must Do When Invoked` - 12 edges
3. `/graphify` - 10 edges
4. `scripts` - 8 edges
5. `graphify reference: extra exports and benchmark` - 8 edges
6. `doRefresh()` - 6 edges
7. `requestGraphQL()` - 6 edges
8. `useIsLoggedIn()` - 6 edges
9. `adaptiveIcon` - 5 edges
10. `expo-router` - 5 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `useIsLoggedIn()`  [EXTRACTED]
  src/app/_layout.tsx → src/stores/auth.ts
- `Index()` --calls--> `hydrateAuth()`  [EXTRACTED]
  src/app/index.tsx → src/stores/auth.ts
- `Index()` --calls--> `useIsHydrated()`  [EXTRACTED]
  src/app/index.tsx → src/stores/auth.ts
- `Index()` --calls--> `useIsLoggedIn()`  [EXTRACTED]
  src/app/index.tsx → src/stores/auth.ts
- `doRefresh()` --calls--> `clearTokens()`  [EXTRACTED]
  src/service/client.ts → src/stores/auth.ts

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (38): config, { defineConfig }, expoConfig, main, name, private, version, date-fns (+30 more)

### Community 1 - "dependencies"
Cohesion: 0.06
Nodes (33): dependencies, axios, date-fns, expo, expo-constants, expo-device, expo-font, expo-glass-effect (+25 more)

### Community 2 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "client.ts"
Cohesion: 0.10
Nodes (27): axios, expo-secure-store, @graphql-typed-document-node/core, zustand, src_graphql_generated_index, src_graphql_generated_index_graphql, login, refreshSession (+19 more)

### Community 5 - "app/_layout.tsx"
Cohesion: 0.09
Nodes (19): expo-router, expo-splash-screen, react, react-native, @rneui/themed, @tanstack/react-query, styles, Index() (+11 more)

### Community 7 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-expo, graphql, @graphql-codegen/cli, @graphql-codegen/client-preset, @graphql-typed-document-node/core, @types/lodash (+2 more)

### Community 8 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 9 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, android, codegen, ios, lint, reset-project, start, web

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

## Knowledge Gaps
- **171 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 188 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `axios` connect `client.ts` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._