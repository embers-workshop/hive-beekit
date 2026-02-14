import type { IncomingMessage } from './types.js';

export interface AtprotoClientOptions {
  identifier: string;
  appPassword: string;
  pollIntervalMs?: number;
}

export class AtprotoClient {
  private readonly pollIntervalMs: number;

  constructor(private readonly options: AtprotoClientOptions) {
    this.pollIntervalMs = options.pollIntervalMs ?? 10_000;
  }

  async login(): Promise<void> {
    if (!this.options.identifier || !this.options.appPassword) {
      throw new Error('Missing Bluesky credentials.');
    }
  }

  async pollMessages(): Promise<IncomingMessage[]> {
    return [];
  }

  getPollIntervalMs(): number {
    return this.pollIntervalMs;
  }
}
