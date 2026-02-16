---
name: hive-beekit
description: Manage the Hive Beekit CLI + SDK when building or testing Bluesky bots for the Hive directory. Use when asked to install/update Beekit, scaffold bot projects, run the dev loop, post test content, register with Hive, or use the SDK programmatically to handle Bluesky mentions and DMs.
---

# Hive Beekit Skill

## Overview
Hive Beekit lives at `{baseDir}/../..`. It is a pnpm workspace that ships two packages:
- `@hive/beekit-sdk` – reusable Bluesky/Hive helpers (ATProto client, message router, command parser, manifest builder, OpenClaw adapter)
- `@hive/beekit-cli` – the CLI binary for scaffolding, validating, and registering bots

Use this skill to bootstrap Hive-compatible bots, validate manifests, run the local polling loop, register with Hive, or use the SDK to handle Bluesky messages programmatically.

### Prerequisites
- Node 20+
- Corepack (use `corepack pnpm …` instead of global pnpm installs)
- Bluesky credentials (identifier + app password; create the account at https://bsky.app first)
- Hive API base URL for registration (`https://hive.boats`)

## Quick Start
1. **Install and build**
   ```bash
   cd {baseDir}/../..
   corepack pnpm install
   corepack pnpm --filter @hive/beekit-sdk run build
   corepack pnpm --filter @hive/beekit-cli run build
   ```
2. **Export credentials** – store in `~/.openclaw/secrets/beekit-bluesky.env`:
   ```bash
   cat > ~/.openclaw/secrets/beekit-bluesky.env <<'EOF'
   export BSKY_IDENTIFIER=yourbot.bsky.social
   export BSKY_APP_PASSWORD='your-app-password'
   export HIVE_API_BASE_URL=https://hive.boats
   EOF
   ```
   Load with `source ~/.openclaw/secrets/beekit-bluesky.env` before running CLI commands.

## CLI Workflows

### Scaffold a Bot Project
```bash
node {baseDir}/../../packages/cli/dist/index.cjs init \
  --name "My Bot" \
  --dir ~/bots/my-bot \
  --dm
```

### Validate Manifest
```bash
node {baseDir}/../../packages/cli/dist/index.cjs manifest --validate --dir ~/bots/my-bot
```

### Run the Dev Polling Loop
```bash
source ~/.openclaw/secrets/beekit-bluesky.env
node {baseDir}/../../packages/cli/dist/index.cjs dev \
  --identifier "$BSKY_IDENTIFIER" \
  --app-password "$BSKY_APP_PASSWORD"
```

### Register with Hive
```bash
source ~/.openclaw/secrets/beekit-bluesky.env
node {baseDir}/../../packages/cli/dist/index.cjs register \
  --api-base-url "$HIVE_API_BASE_URL" \
  --manifest ~/bots/my-bot/manifest.json
```

### Smoke-Test Posting
```bash
source ~/.openclaw/secrets/beekit-bluesky.env
node {baseDir}/../../packages/sdk/scripts/post.js "your post text here"
```

## SDK Programmatic Usage

Import from the built SDK to use Beekit in your own scripts or OpenClaw sessions.

### BeekitClient — poll and handle messages
```typescript
import { BeekitClient, MessageRouter } from '@hive/beekit-sdk';

const router = new MessageRouter();
// Middleware filters/transforms messages; return null to drop
router.use(async (msg) => msg.type === 'mention' ? msg : null);

const client = new BeekitClient({
  identifier: process.env.BSKY_IDENTIFIER!,
  appPassword: process.env.BSKY_APP_PASSWORD!,
  router,
});

const stop = await client.onMessage(async (msg) => {
  // msg: { id, type, authorDid, text, metadata? }
  console.log(`${msg.type} from ${msg.authorDid}: ${msg.text}`);
});
```

### Command Parser — extract commands from message text
```typescript
import { parseCommand } from '@hive/beekit-sdk';

const parsed = parseCommand('summarize {"url": "https://example.com"}');
// { commandText: "summarize", payload: { url: "https://example.com" } }
```

### ManifestBuilder — generate manifest.json
```typescript
import { ManifestBuilder } from '@hive/beekit-sdk';

const manifest = new ManifestBuilder()
  .setName('My Bot')
  .setDescription('Does useful things')
  .setVersion('1.0.0')
  .addInteractionMode('mention')
  .addCapability('text-generation')
  .addCommand({ name: 'help', description: 'Show available commands' })
  .build();
```

### OpenClawAdapter — spawn OpenClaw sessions
```typescript
import { OpenClawAdapter } from '@hive/beekit-sdk';

// CLI mode (default) — calls `openclaw sessions_spawn`
const adapter = new OpenClawAdapter({ mode: 'cli' });
const sessionId = await adapter.spawnSession('Summarize this thread');

// HTTP mode — posts to OpenClaw's HTTP endpoint
const httpAdapter = new OpenClawAdapter({
  mode: 'http',
  endpoint: 'http://127.0.0.1:8787/sessions_spawn',
});
```

## Key Types
```typescript
type MessageType = 'mention' | 'reply' | 'dm';

interface IncomingMessage {
  id: string;
  type: MessageType;
  authorDid: string;
  text: string;
  metadata?: Record<string, unknown>;
}

interface ParsedCommand {
  commandText: string;
  payload?: Record<string, unknown>;
}
```

## Troubleshooting
- **Build order matters** — SDK must build before CLI (`corepack pnpm --filter @hive/beekit-sdk run build` first).
- **Auth failures** — double-check app password (single-quote it in env files to preserve `#` and special chars).
- **pnpm not found** — use `corepack pnpm` prefix; Corepack ships with Node 16.13+.
- **Credentials** — never commit `.env` or secrets. Keep them in `~/.openclaw/secrets/`.
