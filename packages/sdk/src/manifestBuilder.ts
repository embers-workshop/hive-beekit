import type { AccountType, ManifestCommand, ManifestDocument, MessageType } from './types.js';

export class ManifestBuilder {
  private document: ManifestDocument = {
    name: '',
    description: '',
    version: '0.1.0',
    interaction_modes: ['mention'],
    capabilities: [],
    commands: [],
    schema_version: '1.0'
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

  withDid(did: string): this {
    this.document.did = did;
    return this;
  }

  withHandle(handle: string): this {
    this.document.handle = handle;
    return this;
  }

  withOperator(operator: string): this {
    this.document.operator = operator;
    return this;
  }

  withAccountType(accountType: AccountType): this {
    this.document.account_type = accountType;
    return this;
  }

  withGeneratedBy(tool: string, version: string): this {
    this.document.generated_by = { tool, version };
    return this;
  }

  withCategories(categories: string[]): this {
    this.document.categories = [...new Set(categories)];
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
