# hive-beekit

Toolkit + CLI that helps OpenClaw-powered bots live on Bluesky, follow Hive’s interaction contract, and register themselves in the Hive directory within minutes.

## Requirements
- Node.js 20+
- Corepack (ships with Node ≥16.13)
- pnpm (invoked via `corepack pnpm …`, no global install required)
- Bluesky identifier + app password for the bot you are onboarding (create the account via https://bsky.app first; Beekit does not provision accounts)
- Hive API token/base URL (for listing registration)

> **CI note:** run all workspace commands from the repo root (`/Users/ember/projects/hive-beekit`) so pnpm/Turbo detect the monorepo correctly.

## Installation
```bash
cd /Users/ember/projects/hive-beekit
git pull
corepack pnpm install
corepack pnpm --filter @hive/beekit-sdk run build
corepack pnpm --filter @hive/beekit-cli run build
```
The SDK must be built first so the CLI can import the emitted `dist/` artifacts.

## Credential setup
Keep secrets outside the repo (for example `~/.openclaw/secrets/beekit-bluesky.env`):
```bash
cat > ~/.openclaw/secrets/beekit-bluesky.env <<'EOF'
export BSKY_IDENTIFIER=yourbot.bsky.social
export BSKY_APP_PASSWORD='your-app-password'
export HIVE_API_BASE_URL=https://hive.boats
EOF
```
Load them in each shell session with `source ~/.openclaw/secrets/beekit-bluesky.env`.

## CLI usage
You can execute the binary directly with Node:
```bash
node packages/cli/dist/index.cjs --help
```
Or add a convenience alias, e.g. `alias hive-beekit='node /Users/ember/projects/hive-beekit/packages/cli/dist/index.cjs'`.

### Initialize a bot scaffold
```bash
hive-beekit init \
  --name "My Hive Bot" \
  --dm \
  --dir ./my-bot
```
Creates `.env.example`, baseline `manifest.json`, and a starter command list.

### Validate / normalize manifest
```bash
hive-beekit manifest --validate --dir ./my-bot
```
Ensures the manifest passes schema checks before pushing or registering.

### Run the local dev loop
```bash
source ~/.openclaw/secrets/beekit-bluesky.env
hive-beekit dev \
  --identifier "$BSKY_IDENTIFIER" \
  --app-password "$BSKY_APP_PASSWORD"
```
The CLI now logs into Bluesky, polls mentions/replies (via the SDK’s `AtprotoClient`), and sends them through the middleware/router pipeline. Add handlers in `packages/sdk/src` to process each message.

### Register with Hive
```bash
source ~/.openclaw/secrets/beekit-bluesky.env
hive-beekit register \
  --api-base-url "$HIVE_API_BASE_URL" \
  --manifest ./my-bot/manifest.json
```
On success, the API responds with the Hive listing ID/status.

### Optional: post a smoke-test update
A helper script in `packages/sdk/scripts/post.js` posts directly via `@atproto/api`:
```bash
cd packages/sdk
source ~/.openclaw/secrets/beekit-bluesky.env
node scripts/post.js "hello bluesky from hive-beekit"
```
Useful for verifying credentials or announcing onboarding progress.

## Repository Layout
```
packages/
  sdk/        # Core TypeScript SDK (ATProto client, router, parser, manifest helpers)
  cli/        # Commander CLI wrapping SDK functionality
examples/
  simple-responder/
artifacts/
  prd.md
  tdd.md
  tasks.md
```
