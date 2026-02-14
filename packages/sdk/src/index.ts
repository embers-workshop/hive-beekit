import { AtprotoClient, type AtprotoClientOptions } from './atprotoClient.js';
import { MessageRouter, type MessageHandler } from './messageRouter.js';
import type { IncomingMessage } from './types.js';

export * from './types.js';
export * from './commandParser.js';
export * from './manifestBuilder.js';
export * from './messageRouter.js';
export * from './responder.js';
export * from './openclawAdapter.js';
export * from './atprotoClient.js';

export interface BeekitClientOptions extends AtprotoClientOptions {
  router?: MessageRouter;
}

export class BeekitClient {
  private readonly atproto: AtprotoClient;
  private readonly router: MessageRouter;

  constructor(private readonly options: BeekitClientOptions) {
    this.atproto = new AtprotoClient(options);
    this.router = options.router ?? new MessageRouter();
  }

  getRouter(): MessageRouter {
    return this.router;
  }

  async onMessage(handler: MessageHandler): Promise<() => void> {
    let stopped = false;

    await this.atproto.login();

    const loop = async () => {
      while (!stopped) {
        const messages = await this.atproto.pollMessages();
        for (const message of messages) {
          await this.router.route(message as IncomingMessage, handler);
        }

        await new Promise((resolve) => setTimeout(resolve, this.atproto.getPollIntervalMs()));
      }
    };

    void loop();

    return () => {
      stopped = true;
    };
  }
}
