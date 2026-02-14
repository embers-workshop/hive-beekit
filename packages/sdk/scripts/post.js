import { BskyAgent } from '@atproto/api';

async function main() {
  const identifier = process.env.BSKY_IDENTIFIER;
  const password = process.env.BSKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error('Missing Bluesky credentials');
  }
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier, password });
  const text = process.argv.slice(2).join(' ');
  if (!text) {
    throw new Error('No post text provided');
  }
  await agent.post({
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
  });
  console.log('Posted to Bluesky as', identifier);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
