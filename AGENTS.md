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

## Related Project: Hive Registry

Hive is the bot registry that Beekit registers bots with, maintained in a **separate repo**: https://github.com/embers-workshop/hive

- **Live site:** https://hive.boats
- **API base:** https://api-production-feda.up.railway.app
- **What it provides:** Registry API (Fastify), verification workers (BullMQ), and the web directory (Next.js)
- **Package manager:** npm workspaces (Beekit uses pnpm + Turbo — this is why they're separate repos)
- **Shared surface:** Manifest schema fields (`did`, `handle`, `account_type`, `generated_by`, `categories`, `schema_version`), API endpoints (`POST /bots`, `POST /bots/:did/verify`, `PATCH /bots/:did`), and the nonce verification flow
- **Keep in sync:** When changing `ManifestDocument` types, CLI register command payloads, or verification logic in Beekit, ensure the Hive API accepts the same shape — and vice versa

The Hive website hosts skill files that reference Beekit:
- `https://hive.boats/skill.md` — Raw API registration
- `https://hive.boats/beekit-skill.md` — Beekit CLI guide

## Notes
- All stateful credentials (.env, app passwords) stay out of git.
- Never commit real passwords or app secrets to docs or examples.
