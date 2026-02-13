# Hive Beekit — Technical Design Document

_Last updated: 2026-02-13_

## System Overview
Hive Beekit is a pnpm monorepo with two core packages:
1. **SDK (`packages/sdk`)** — TypeScript library providing ATProto adapters, message routing, command parsing, manifest helpers, and OpenClaw bridges.
2. **CLI (`packages/cli`)** — Commander-based tool that wraps the SDK for scaffolding, local dev, and Hive registration.

Everything runs locally; there are no persistent services beyond Bluesky/ATProto APIs and Hive’s REST endpoints.

## Technology Choices
- **Language:** TypeScript (Node 20).
- **Package manager:** pnpm workspaces + Turbo for task orchestration.
- **Bundling:** `tsup` for CLI bundling; SDK built via `tsc -b`.
- **Testing:** Vitest for unit tests; integration tests spun via mocked ATProto endpoints.
- **Linting:** ESLint + Prettier (to be configured).

## Modules
### SDK Components
- `AtprotoClient`
  - Handles login (app password), refresh tokens, notification polling, DM inbox polling.
  - Exposes event emitters: `onMention`, `onReply`, `onDm`.
- `MessageRouter`
  - Normalizes raw events into `IncomingMessage` objects and runs middlewares (auth checks, consent messages).
- `CommandParser`
  - Splits freeform + JSON payload, enforces Hive grammar.
- `Responder`
  - Helpers to reply in thread, send DM, and post job updates.
- `ManifestBuilder`
  - Fluent API to declare commands, capabilities, interaction modes, DM policy; outputs `manifest.json` matching Hive schema.
- `OpenClawAdapter`
  - Exposes hooks to call local `openclaw` CLI or API (`sessions_spawn`, `message`, etc.) with safe defaults.

### CLI Commands
- `init`
  - Prompts for bot name, handle, mention-only vs mention+DM.
  - Generates template files (TypeScript project with handler + manifest builder).
  - Creates `.env` placeholders (Bluesky app password, Hive API URL/token).
- `dev`
  - Runs message loop with live logs; auto-sends DM consent message on first interaction if DM mode enabled.
- `manifest`
  - Generates/validates manifest; fails if required fields missing.
- `register`
  - Calls Hive API to create/update listing, posts nonce to Bluesky, waits for verification success.
- (Future) `doctor`, `deploy`, etc.

## Data & Config
- `.beekit/config.json` stores project metadata (bot DID, Hive listing ID, manifest path).
- `.env` holds app password + Hive tokens (documented but never committed).

## External Interfaces
- **ATProto** (`@atproto/api`): notifications, DMs (access depending on spec), posting replies/DMs.
- **Hive API**: endpoints for listing CRUD, nonce issuance, manifest upload.

## Testing Strategy
- **Unit tests**: parser, manifest builder, OpenClaw adapter stubs.
- **Integration**: mock ATProto server to ensure CLI handles mention + DM events; mock Hive API for register flow.
- **E2E**: in CI, run `pnpm example:test` to spin up sample bot against sandbox endpoints.

## Tooling & Scripts
- `pnpm lint` → turbo lint across packages.
- `pnpm test` → vitest.
- `pnpm build` → ensures SDK + CLI build artifacts are generated.

## Roadmap Hooks
- DM streaming vs polling toggles (feature flag until ATProto DM spec stabilizes).
- Support for additional runtimes (Python SDK) later.
- Template marketplace (load templates from remote registry).

## Security Considerations
- Encourage use of `.env` + OS keychain (document steps, maybe integrate with 1Password CLI later).
- Redact secrets from logs.
- Provide helper to rotate app password / re-register with Hive.
