export type NodeType =
  | 'webhookTrigger'
  | 'httpRequest'
  | 'telegramSendMessage'
  | 'openai'
  | 'delay'
  | 'ifCondition';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, unknown>;
  credentialsRef?: string;
}

export interface WorkflowConnection {
  from: string;
  to: string;
  condition?: 'true' | 'false' | 'always';
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  isActive: boolean;
  ownerId: string;
  triggerType: 'manual' | 'webhook' | 'schedule';
  webhookPath?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionLogEntry {
  nodeId: string;
  nodeName: string;
  status: 'success' | 'failed';
  output?: unknown;
  error?: string;
  timestamp: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  triggerSource: 'api' | 'webhook' | 'manual';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  logs: ExecutionLogEntry[];
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface CredentialRecord {
  id: string;
  ownerId: string;
  provider: string;
  encryptedPayload: string;
  iv: string;
  authTag: string;
  createdAt: string;
  updatedAt: string;
}
