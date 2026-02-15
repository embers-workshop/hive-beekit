# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

All commands run from the repo root. Uses pnpm (via Corepack) + Turborepo.

```bash
corepack pnpm install              # install all deps
corepack pnpm run build            # build all packages (turbo build)
corepack pnpm run test             # run tests across workspace (turbo test)
corepack pnpm run lint             # lint all packages (turbo lint)

# Build individual packages (SDK must build before CLI)
corepack pnpm --filter @hive/beekit-sdk run build    # tsc -b
corepack pnpm --filter @hive/beekit-cli run build    # tsup → dist/index.cjs

# Dev watch mode
corepack pnpm --filter @hive/beekit-sdk run dev      # tsup --watch
corepack pnpm --filter @hive/beekit-cli run dev      # tsup --watch

# Run CLI directly
node packages/cli/dist/index.cjs --help

# Run SDK tests
cd packages/sdk && pnpm run test                     # vitest
```

## Architecture

Monorepo with two packages:

- **`packages/sdk`** (`@hive/beekit-sdk`) — Core TypeScript SDK for building Bluesky bots that integrate with the Hive directory. Key modules:
  - `atprotoClient.ts` — BskyAgent wrapper: auth, notification polling with dedup, converts notifications to `IncomingMessage`
  - `messageRouter.ts` — Chain-of-responsibility middleware pipeline for filtering/transforming messages
  - `commandParser.ts` — Extracts command text + optional JSON payload per Hive grammar
  - `manifestBuilder.ts` — Fluent builder with validation for Hive-compatible `manifest.json`
  - `responder.ts` — Transport abstraction for posting replies/DMs
  - `openclawAdapter.ts` — Spawns OpenClaw sessions (CLI or HTTP mode)
  - `index.ts` — `BeekitClient` facade: ties auth, polling loop, and router together

- **`packages/cli`** (`@hive/beekit-cli`) — Commander.js CLI wrapping the SDK. Commands: `init`, `manifest`, `dev`, `register`. Built to a single CJS bundle via tsup.

## Key Conventions

- Node 20+, TypeScript strict mode, ES2022 target, NodeNext module resolution
- SDK builds with `tsc -b` (emits `.js` + `.d.ts`); CLI bundles with tsup to CommonJS
- Conventional Commits for git history
- Credentials via env vars (`BSKY_IDENTIFIER`, `BSKY_APP_PASSWORD`, `HIVE_API_BASE_URL`) — never committed

## Hive Registry Relationship

Beekit registers bots with the Hive registry (separate repo: `embers-workshop/hive`). When changing `ManifestDocument` types, CLI register payloads, or verification logic, ensure the Hive API (`https://api.hive.boats`) accepts the same shape. Shared surface: manifest schema fields, API endpoints (`POST /bots`, `POST /bots/:did/verify`, `PATCH /bots/:did`), and nonce verification flow.
