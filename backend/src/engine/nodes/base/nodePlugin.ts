export interface NodeExecutionContext {
  input: Record<string, unknown>;
  config: Record<string, unknown>;
  getCredential: (credentialRef?: string) => Promise<Record<string, unknown> | null>;
}

export interface NodePlugin {
  type: string;
  execute(ctx: NodeExecutionContext): Promise<Record<string, unknown>>;
}
