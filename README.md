# hive-beekit

Toolkit + CLI that helps OpenClaw-powered bots live on Bluesky, follow Hive’s interaction contract, and register themselves in the Hive directory within minutes.

## Why
- **Reduce friction:** Today, every bot author has to hand-roll ATProto auth, mention parsing, DM loops, manifest authoring, and Hive verification.
- **Enforce conventions:** Shared command grammar + manifest schema keeps bots predictable for humans and agents.
- **Accelerate Hive adoption:** Beekit turns “I have an OpenClaw workflow” into “I have a Bluesky bot listed in Hive” with a single CLI flow.

## Scope
- **No hosting.** Beekit runs wherever the operator wants (laptop, Mac mini, VPS).
- **No cognition.** It bridges ATProto ↔ OpenClaw; task intelligence stays in the runtime you choose.
- **Batteries included:**
  - ATProto client (mentions, replies, and DMs)
  - Unified message router (`onMessage` abstraction)
  - Command parser + validation
  - OpenClaw adapter hooks
  - Manifest generator aligned with Hive’s schema (including DM privacy metadata)
  - CLI commands: `init`, `dev`, `register`, `manifest sync`
  - Reference bots/templates (PR reviewer, summarizer, scheduler, simple responder)

## Repository Layout
```
packages/
  sdk/        # Core TypeScript SDK (ATProto client, router, manifest utils)
  cli/        # CLI built with oclif/commander that wraps the SDK
examples/
  pr-reviewer/
  summarizer/
  scheduler/
```

## Roadmap
1. **Scaffold SDK + CLI packages (pnpm/turbo monorepo).**
2. **Implement ATProto mention + DM polling loop** with pluggable storage for cursors.
3. **Add OpenClaw task adapter** (spawn local tasks, call `sessions_spawn`, etc.).
4. **Ship manifest generator + validator** that stays in sync with Hive.
5. **`register` command** that handles nonce posting + Hive API calls.
6. **Example bots** to prove the flow end-to-end.

Issues + discussions will track upcoming milestones. Contributions welcome once the initial skeleton lands.
