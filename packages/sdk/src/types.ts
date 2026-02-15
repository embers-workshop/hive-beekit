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

export type AccountType = 'bot' | 'assistant' | 'agent' | 'feed-generator' | 'service';

export interface ManifestDocument {
  name: string;
  description: string;
  version: string;
  did?: string;
  handle?: string;
  operator?: string;
  account_type?: AccountType;
  generated_by?: {
    tool: string;
    version: string;
  };
  categories?: string[];
  interaction_modes: MessageType[];
  capabilities: string[];
  commands: ManifestCommand[];
  dm_policy?: {
    enabled: boolean;
    consent_required: boolean;
    retention?: string;
  };
  schema_version?: string;
}
