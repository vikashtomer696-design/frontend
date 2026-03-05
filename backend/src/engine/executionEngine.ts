import { CredentialRepository } from '../repositories/credentialRepository';
import { ExecutionLogEntry, WorkflowDefinition } from '../types/workflow';
import { decrypt } from '../utils/crypto';
import { NodeRegistry } from './nodeRegistry';

export class ExecutionEngine {
  constructor(
    private readonly nodeRegistry: NodeRegistry,
    private readonly credentialRepository: CredentialRepository
  ) {}

  async executeWorkflow(
    workflow: WorkflowDefinition,
    initialInput: Record<string, unknown>
  ): Promise<{ output: Record<string, unknown>; logs: ExecutionLogEntry[] }> {
    const logs: ExecutionLogEntry[] = [];
    const nodeMap = new Map(workflow.nodes.map((node) => [node.id, node]));

    let currentNodeId = workflow.nodes[0]?.id;
    let context = { ...initialInput };

    while (currentNodeId) {
      const node = nodeMap.get(currentNodeId);
      if (!node) break;

      try {
        const plugin = this.nodeRegistry.get(node.type);
        const output = await plugin.execute({
          input: context,
          config: { ...node.config, credentialsRef: node.credentialsRef },
          getCredential: async (credentialRef?: string) => {
            if (!credentialRef) return null;
            const record = await this.credentialRepository.findById(credentialRef);
            if (!record) return null;
            return JSON.parse(
              decrypt({
                encrypted: record.encryptedPayload,
                iv: record.iv,
                authTag: record.authTag
              })
            ) as Record<string, unknown>;
          }
        });

        context = { ...context, ...output };

        logs.push({
          nodeId: node.id,
          nodeName: node.name,
          status: 'success',
          output,
          timestamp: new Date().toISOString()
        });

        const connections = workflow.connections.filter((c) => c.from === node.id);
        const branch = (output.branch as 'true' | 'false' | undefined) ?? 'always';
        const next =
          connections.find((c) => c.condition === branch) ??
          connections.find((c) => c.condition === 'always') ??
          connections[0];

        currentNodeId = next?.to;
      } catch (error) {
        logs.push({
          nodeId: node.id,
          nodeName: node.name,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown execution error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    }

    return { output: context, logs };
  }
}
