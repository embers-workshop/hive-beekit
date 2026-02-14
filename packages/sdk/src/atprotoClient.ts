import { BskyAgent, AppBskyFeedPost } from '@atproto/api';
import type { IncomingMessage } from './types.js';

export interface AtprotoClientOptions {
  identifier: string;
  appPassword: string;
  pollIntervalMs?: number;
  serviceUrl?: string;
}

export class AtprotoClient {
  private readonly pollIntervalMs: number;
  private readonly serviceUrl: string;
  private agent: BskyAgent | null = null;
  private loggedIn = false;
  private lastSeenIndexedAt?: number;

  constructor(private readonly options: AtprotoClientOptions) {
    this.pollIntervalMs = options.pollIntervalMs ?? 10_000;
    this.serviceUrl = options.serviceUrl ?? 'https://bsky.social';
  }

  private getAgent(): BskyAgent {
    if (!this.agent) {
      this.agent = new BskyAgent({ service: this.serviceUrl });
    }
    return this.agent;
  }

  async login(): Promise<void> {
    if (this.loggedIn) {
      return;
    }

    if (!this.options.identifier || !this.options.appPassword) {
      throw new Error('Missing Bluesky credentials.');
    }

    const agent = this.getAgent();
    await agent.login({ identifier: this.options.identifier, password: this.options.appPassword });
    this.loggedIn = true;
  }

  async pollMessages(): Promise<IncomingMessage[]> {
    if (!this.loggedIn) {
      await this.login();
    }

    const agent = this.getAgent();
    const { data } = await agent.listNotifications({ limit: 30 });

    if (!data.notifications?.length) {
      return [];
    }

    const newMessages: IncomingMessage[] = [];
    let newestIndexedAt = this.lastSeenIndexedAt ?? 0;

    for (const notification of data.notifications) {
      const indexedAtMs = notification.indexedAt ? Date.parse(notification.indexedAt) : undefined;
      if (indexedAtMs) {
        if (this.lastSeenIndexedAt && indexedAtMs <= this.lastSeenIndexedAt) {
          continue;
        }
        if (indexedAtMs > newestIndexedAt) {
          newestIndexedAt = indexedAtMs;
        }
      }

      if (notification.reason !== 'mention' && notification.reason !== 'reply') {
        continue;
      }

      const record = notification.record as AppBskyFeedPost.Record | undefined;
      newMessages.push({
        id: notification.uri,
        type: notification.reason === 'mention' ? 'mention' : 'reply',
        authorDid: notification.author?.did ?? 'unknown',
        text: record?.text ?? '',
        metadata: {
          uri: notification.uri,
          cid: notification.cid,
          indexedAt: notification.indexedAt,
          reason: notification.reason,
          record,
        },
      });
    }

    if (newMessages.length > 0) {
      await agent.app.bsky.notification
        .updateSeen({ seenAt: new Date().toISOString() })
        .catch(() => undefined);
    }

    if (newestIndexedAt > (this.lastSeenIndexedAt ?? 0)) {
      this.lastSeenIndexedAt = newestIndexedAt;
    }

    return newMessages.sort((a, b) => {
      const aTime = a.metadata?.indexedAt ? Date.parse(String(a.metadata.indexedAt)) : 0;
      const bTime = b.metadata?.indexedAt ? Date.parse(String(b.metadata.indexedAt)) : 0;
      return aTime - bTime;
    });
  }

  getPollIntervalMs(): number {
    return this.pollIntervalMs;
  }
}
