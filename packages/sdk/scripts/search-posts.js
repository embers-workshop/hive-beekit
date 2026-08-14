import { BskyAgent } from '@atproto/api';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function loadLocalEnv() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(scriptDir, '../../..', '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

async function main() {
  loadLocalEnv();
  const identifier = process.env.BSKY_IDENTIFIER;
  const password = process.env.BSKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error('Missing Bluesky credentials');
  }

  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    throw new Error('No search query provided');
  }

  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier, password });
  const { data } = await agent.app.bsky.feed.searchPosts({
    q: query,
    sort: 'latest',
    limit: 20,
  });

  for (const post of data.posts ?? []) {
    console.log(JSON.stringify({
      indexedAt: post.indexedAt,
      author: post.author.handle,
      uri: post.uri,
      cid: post.cid,
      text: post.record?.text ?? '',
      likeCount: post.likeCount ?? 0,
      replyCount: post.replyCount ?? 0,
      liked: Boolean(post.viewer?.like),
    }));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
