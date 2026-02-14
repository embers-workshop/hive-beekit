import type { ManifestCommand, ManifestDocument, MessageType } from './types.js';

export class ManifestBuilder {
  private document: ManifestDocument = {
    name: '',
    description: '',
    version: '0.1.0',
    interaction_modes: ['mention'],
    capabilities: [],
    commands: []
  };

  withName(name: string): this {
    this.document.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.document.description = description;
    return this;
  }

  withVersion(version: string): this {
    this.document.version = version;
    return this;
  }

  withInteractionModes(modes: MessageType[]): this {
    this.document.interaction_modes = [...new Set(modes)];
    return this;
  }

  withCapabilities(capabilities: string[]): this {
    this.document.capabilities = [...new Set(capabilities)];
    return this;
  }

  addCommand(command: ManifestCommand): this {
    this.document.commands.push(command);
    return this;
  }

  withDmPolicy(consentRequired = true, retention = 'ephemeral'): this {
    this.document.dm_policy = {
      enabled: true,
      consent_required: consentRequired,
      retention
    };
    return this;
  }

  build(): ManifestDocument {
    validateManifest(this.document);
    return structuredClone(this.document);
  }
}

export function validateManifest(manifest: ManifestDocument): void {
  if (!manifest.name.trim()) {
    throw new Error('Manifest name is required.');
  }

  if (!manifest.description.trim()) {
    throw new Error('Manifest description is required.');
  }

  if (!manifest.interaction_modes.length) {
    throw new Error('At least one interaction mode is required.');
  }

  if (!manifest.commands.length) {
    throw new Error('At least one command is required.');
  }
}
