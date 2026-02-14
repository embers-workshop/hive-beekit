export type MessageType = 'mention' | 'reply' | 'dm';

export interface IncomingMessage {
  id: string;
  type: MessageType;
  authorDid: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface ParsedCommand {
  commandText: string;
  payload?: Record<string, unknown>;
}

export interface ResponseTarget {
  conversationId?: string;
  rootUri?: string;
  parentUri?: string;
  recipientDid?: string;
}

export interface ManifestCommand {
  name: string;
  description: string;
  input_schema?: Record<string, unknown>;
}

export interface ManifestDocument {
  name: string;
  description: string;
  version: string;
  interaction_modes: MessageType[];
  capabilities: string[];
  commands: ManifestCommand[];
  dm_policy?: {
    enabled: boolean;
    consent_required: boolean;
    retention?: string;
  };
}
