export interface IncomingMessage {
  id: string;
  type: 'mention' | 'reply' | 'dm';
  authorDid: string;
  text: string;
  metadata: Record<string, unknown>;
}

export type MessageHandler = (msg: IncomingMessage) => Promise<void> | void;

export class BeekitClient {
  constructor(public handle: string) {}

  async onMessage(handler: MessageHandler) {
    // TODO: wire up ATProto polling + DM support
    throw new Error('Not implemented yet.');
  }
}
