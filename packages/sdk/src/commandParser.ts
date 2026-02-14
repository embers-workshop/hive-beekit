import type { ParsedCommand } from './types.js';

export class CommandParserError extends Error {}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new CommandParserError('Message is empty.');
  }

  const jsonStart = trimmed.indexOf('{');
  if (jsonStart === -1) {
    return { commandText: trimmed };
  }

  const commandText = trimmed.slice(0, jsonStart).trim();
  const payloadString = trimmed.slice(jsonStart).trim();

  try {
    const payload = JSON.parse(payloadString);
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new CommandParserError('JSON payload must be an object.');
    }

    return {
      commandText: commandText || 'run',
      payload: payload as Record<string, unknown>
    };
  } catch (error) {
    if (error instanceof CommandParserError) {
      throw error;
    }

    throw new CommandParserError('Invalid JSON payload in command text.');
  }
}
