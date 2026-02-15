---
name: hive-beekit
description: Manage the Hive Beekit CLI + SDK when building or testing Bluesky bots for the Hive directory. Use when asked to install/update Beekit, scaffold bot projects, run the dev loop, post test content, or document onboarding steps for Hive/Bluesky operators.
---

# Hive Beekit Skill

## Overview
Hive Beekit lives at `/Users/ember/projects/hive-beekit`. It is a pnpm workspace that ships two packages:
- `@hive/beekit-sdk` – reusable Bluesky/Hive helpers
- `@hive/beekit-cli` – the CLI binary exposed as `hive-beekit`

Use this skill whenever you need to bootstrap a Hive-compatible bot, validate manifests, run the local polling loop, or document Beekit usage for others.

### Prerequisites
- Node 20+ (already installed)
- Corepack (use `corepack pnpm …` instead of global pnpm installs)
- Bluesky credentials (identifier/app password) and optional Hive API token (sign up at https://bsky.app first; Beekit doesn’t create accounts)

## Quick Start
1. **Update and install deps**
   ```bash
   cd /Users/ember/projects/hive-beekit
   git pull
   corepack pnpm install
   corepack pnpm --filter @hive/beekit-sdk run build
   corepack pnpm --filter @hive/beekit-cli run build
   ```
2. **Export credentials** – store in `~/.openclaw/secrets/beekit-bluesky.env`:
   ```bash
   cat > ~/.openclaw/secrets/beekit-bluesky.env <<'EOF'
   export BSKY_IDENTIFIER=helloember999.bsky.social
   export BSKY_APP_PASSWORD='REDACTED'
   export HIVE_API_BASE_URL=https://web-production-383a3.up.railway.app
   EOF
   ```
   Load with `source ~/.openclaw/secrets/beekit-bluesky.env` before running CLI commands.
3. **Add the CLI to PATH (optional)** – you can invoke it via node directly:
   ```bash
   node packages/cli/dist/index.cjs --help
   ```
   or symlink to `~/bin/hive-beekit` if desired.

## Core Workflows

### Scaffold a Bot Project
```bash
node packages/cli/dist/index.cjs init \
  --name "My Bot" \
  --dir ~/bots/my-bot \
  --dm
```
Creates `.env.example`, baseline `manifest.json`, and categories. Add any custom commands afterward.

### Validate & Normalize Manifest
```bash
node packages/cli/dist/index.cjs manifest --validate --dir ~/bots/my-bot
```
Rewrites `manifest.json` with normalized spacing and ensures it passes schema checks. Run before registering or pushing updates.

### Run the Dev Polling Loop
```bash
source ~/.openclaw/secrets/beekit-bluesky.env
node packages/cli/dist/index.cjs dev \
  --identifier "$BSKY_IDENTIFIER" \
  --app-password "$BSKY_APP_PASSWORD"
```
The SDK now connects to Bluesky, polls mentions/replies, and routes them through the message router. Add middleware/handlers in `packages/sdk/src` as needed.

### Register with Hive
```bash
node packages/cli/dist/index.cjs register \
  --api-base-url "$HIVE_API_BASE_URL" \
  --manifest ~/bots/my-bot/manifest.json
```
Ensure the manifest includes the public `manifest_url` Hive should crawl. Successful response echoes a listing ID / status.

### Smoke-Test Posting (helper script)
When you need to confirm creds or seed a diagnostic post:
```bash
cd packages/sdk
source ~/.openclaw/secrets/beekit-bluesky.env
node scripts/post.js "your post text here"
```
`scripts/post.js` uses `@atproto/api` directly to post as the configured account.

## Maintenance & Troubleshooting
- **pnpm missing?** Corepack handles it. Use `corepack enable` only if you have write access to `/usr/local/bin`; otherwise stick to `corepack pnpm` prefixed commands.
- **Bluesky auth failures** – double-check app password spelling (including symbols). The helper env file wraps the password in single quotes to preserve `#`.
- **CLI build errors** – ensure `@hive/beekit-sdk` is built before the CLI so TypeScript output exists in `packages/sdk/dist`.
- **Turbo errors about package manager** – root `package.json` already declares `"packageManager": "pnpm@10.29.3"`. When running `pnpm run build`, use `corepack pnpm run build` so `turbo` can find pnpm.
- **Credential hygiene** – never commit `.env` or secrets. Keep helper files in `~/.openclaw/secrets/` or export ad-hoc vars in the shell session.

## Updating Documentation
When asked for "detailed instructions in the repo", edit `/Users/ember/projects/hive-beekit/README.md`:
- Add/refresh **Prerequisites**, **Install**, **Usage** sections mirroring the workflows above.
- Document the exact commands (`corepack pnpm install`, `hive-beekit init`, etc.).
- Include notes on Corepack, pnpm, and where to place credentials.

Keep README examples in sync with the CLI flags so new operators can copy/paste without surprises.
