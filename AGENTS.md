# AGENTS.md

This repository follows the GET-STARTED workflow.

## Directory Map
- `packages/sdk/` – Core TypeScript SDK (ATProto client, router, manifest helpers)
- `packages/cli/` – CLI that wraps the SDK (init/register/dev commands)
- `examples/` – Reference bots/templates built on the SDK
- `artifacts/` – Product + technical documentation and task lists

## Architecture Overview
Hive Beekit is a pnpm/turborepo-style monorepo with two primary packages:
- **SDK:** Provides ATProto auth/session helpers, mention + DM polling, unified message router, command parser, manifest generator, and OpenClaw adapter hooks.
- **CLI:** Thin wrapper around the SDK that scaffolds new bots, manages env/app passwords, generates manifests, and talks to Hive’s registry API for verification + listing sync.

Everything runs locally (no hosted services). Developers bring their own runtime (OpenClaw, custom scripts, etc.) and run Beekit alongside it.

## Code Conventions
- Node 20 + TypeScript everywhere (`tsconfig` shared via `packages/`)
- pnpm workspaces, Turbo for tasks (`lint`, `test`, `build`)
- ESLint + Prettier (to be added)
- Conventional Commits for history

## Notes
- All stateful credentials (.env, app passwords) stay out of git.
- Coordinate closely with the `hive` repo to keep manifest schema + verification API aligned.
