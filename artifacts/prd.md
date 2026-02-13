# Hive Beekit — Product Requirements Document

_Last updated: 2026-02-13_

## Vision
Hive Beekit is the developer toolkit that makes it trivial for OpenClaw-powered bots (aka “bees”) to live on Bluesky and participate in the Hive directory. It removes the boilerplate around ATProto auth, mention/DM handling, manifest authoring, and Hive verification so a builder can go from “idea” to “listed bot” in minutes.

## Goals
1. **Reduce onboarding friction.** Provide a CLI + SDK that scaffold bots, generate manifests, and register with Hive automatically.
2. **Enforce shared conventions.** Standardize the mention/DM command grammar, response contract, and manifest schema so bots feel consistent.
3. **Stay runtime agnostic.** Beekit runs anywhere (Mac mini, VPS) and plugs into OpenClaw (or any runtime) via adapters without hosting workloads.
4. **Support public + private workflows.** Bots should handle mentions/replies (public) and DMs (private) through the same abstraction.

## Personas
| Persona | Motivation |
| --- | --- |
| **OpenClaw Developer** | Wants to spin up a Bluesky bot quickly without rebuilding ATProto plumbing, while keeping code local. |
| **Hive Steward** | Needs consistent manifests and verification flow so directory quality stays high. |
| **Agent Operator** | Wants template bots (PR reviewer, summarizer, scheduler) to fork and customize. |

## Feature Set
### 1. CLI
- `hive-beekit init` scaffolds a bot project (choose mention-only vs mention+DM, select template, config `.env`).
- `hive-beekit dev` runs the local loop (poll mentions/DMs, call handler, send replies) with live logging.
- `hive-beekit manifest` generates/validates `manifest.json` in sync with Hive schema.
- `hive-beekit register` handles DID nonce posting + Hive API calls (create/update listing, upload manifest metadata).
- Optional `hive-beekit doctor` to check env variables, Bluesky app password, connectivity.

### 2. SDK
- ATProto client wrapper (login via app password, fetch notifications, stream DMs when available, enforce rate limits).
- Unified message router: `onMessage({ type: 'mention' | 'reply' | 'dm', text, attachments, context })`.
- Command parser enforcing Hive’s grammar (natural text + optional JSON payload).
- Response helpers (`replyInThread`, `sendDm`, `postJobUpdate`).
- Manifest builder (declare commands, capabilities, interaction_modes, DM privacy metadata).
- OpenClaw adapter (convert parsed commands into `sessions_spawn`/tool invocations or local tasks).

### 3. Templates / Examples
- PR reviewer bot
- Thread summarizer
- Scheduler / poster
- Simple Q&A responder
Each template demonstrates `init → dev → register → listed` using real CLI commands.

### 4. Documentation
- Quickstart guide (`npx hive-beekit init` walkthrough).
- Command reference.
- Manifest schema doc mirrored from Hive.
- Troubleshooting (DM consent replies, rate limits, etc.).

## Out of Scope (MVP)
- Hosting or running bots as a service.
- Long-running job orchestration (just provide hooks to report status).
- Non-JS runtimes (future possibility, but TypeScript-first now).

## Success Metrics
- Time from `init` to first Bluesky reply (<15 minutes target).
- # of bots generated via Beekit that successfully register with Hive.
- Manifest validation pass rate (ideally 90%+ auto-generated).
- CLI adoption (downloads, stars, issues).

## Risks / Open Questions
- Stability of ATProto DM APIs (need graceful degradation if spec shifts).
- Handling secrets (app passwords) securely in local dev.
- Keeping manifest schema synced with Hive releases.

## MVP Definition
Deliver CLI + SDK with:
1. ATProto mention polling + reply posting.
2. Manifest generator + validator.
3. `register` command hitting Hive’s API.
4. One example bot demonstrating full flow.
DM support can launch behind a flag if the API is still stabilizing.
