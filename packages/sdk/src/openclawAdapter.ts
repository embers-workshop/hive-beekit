import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface OpenClawAdapterOptions {
  mode?: 'cli' | 'http';
  commandPath?: string;
  endpoint?: string;
}

export class OpenClawAdapter {
  constructor(private readonly options: OpenClawAdapterOptions = {}) {}

  async spawnSession(prompt: string): Promise<string> {
    if ((this.options.mode ?? 'cli') === 'http') {
      const endpoint = this.options.endpoint ?? 'http://127.0.0.1:8787/sessions_spawn';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`OpenClaw HTTP call failed with ${response.status}`);
      }

      const data = (await response.json()) as { id?: string };
      return data.id ?? 'unknown-session';
    }

    const cmd = this.options.commandPath ?? 'openclaw';
    const { stdout } = await execFileAsync(cmd, ['sessions_spawn', '--prompt', prompt]);
    return stdout.trim();
  }
}
