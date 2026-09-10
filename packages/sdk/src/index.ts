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
  onPollError?: (error: unknown) => void;
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

const TRANSIENT_NETWORK_ERROR_CODES = new Set([
  'EAI_AGAIN',
  'ECONNREFUSED',
  'ECONNRESET',
  'ENETDOWN',
  'ENETUNREACH',
  'ETIMEDOUT',
  'UND_ERR_BODY_TIMEOUT',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_SOCKET',
]);

function hasTransientNetworkCause(error: unknown): boolean {
  const seen = new Set<object>();
  let current = error;

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);

    if ('code' in current) {
      const code = (current as { code?: unknown }).code;
      if (typeof code === 'string' && TRANSIENT_NETWORK_ERROR_CODES.has(code)) {
        return true;
      }
    }

    current = 'cause' in current ? (current as { cause?: unknown }).cause : undefined;
  }

  return false;
}

export function isTransientPollError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return (
    status === 429 ||
    (status !== undefined && status >= 500 && status <= 599) ||
    hasTransientNetworkCause(error)
  );
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
        try {
          const messages = await this.atproto.pollMessages();
          for (const message of messages) {
            await this.router.route(message as IncomingMessage, handler);
          }
        } catch (error) {
          if (!isTransientPollError(error)) {
            throw error;
          }
          this.options.onPollError?.(error);
        }

        if (!stopped) {
          await new Promise((resolve) => setTimeout(resolve, this.atproto.getPollIntervalMs()));
        }
      }
    };

    void loop();

    return () => {
      stopped = true;
    };
  }
}
