import type { IncomingMessage } from './types.js';

export type Middleware = (message: IncomingMessage) => Promise<IncomingMessage | null>;
export type MessageHandler = (message: IncomingMessage) => Promise<void> | void;

export class MessageRouter {
  private readonly middlewares: Middleware[] = [];

  use(middleware: Middleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  async route(message: IncomingMessage, handler: MessageHandler): Promise<boolean> {
    let currentMessage: IncomingMessage | null = message;

    for (const middleware of this.middlewares) {
      if (!currentMessage) {
        return false;
      }
      currentMessage = await middleware(currentMessage);
    }

    if (!currentMessage) {
      return false;
    }

    await handler(currentMessage);
    return true;
  }
}
