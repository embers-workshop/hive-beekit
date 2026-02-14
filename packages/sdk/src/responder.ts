import type { ResponseTarget } from './types.js';

export interface ResponderTransport {
  postReply(target: ResponseTarget, text: string): Promise<void>;
  postDm(target: ResponseTarget, text: string): Promise<void>;
  postUpdate(target: ResponseTarget, text: string): Promise<void>;
}

export class Responder {
  constructor(private readonly transport: ResponderTransport) {}

  replyInThread(target: ResponseTarget, text: string): Promise<void> {
    return this.transport.postReply(target, text);
  }

  sendDm(target: ResponseTarget, text: string): Promise<void> {
    return this.transport.postDm(target, text);
  }

  postJobUpdate(target: ResponseTarget, text: string): Promise<void> {
    return this.transport.postUpdate(target, text);
  }
}
