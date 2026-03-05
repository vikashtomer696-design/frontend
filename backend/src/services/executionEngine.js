import { createLog } from '../utils/logger.js';

export class ExecutionEngine {
  constructor({ nodeRegistry, executionRepository, logRepository }) {
    this.nodeRegistry = nodeRegistry;
    this.executionRepository = executionRepository;
    this.logRepository = logRepository;
  }

  async run({ executionId, workflow, input = {} }) {
    const nodeMap = new Map(workflow.nodes.map((node) => [node.id, node]));
    const outbound = workflow.connections.reduce((acc, conn) => {
      acc[conn.source] = acc[conn.source] || [];
      acc[conn.source].push(conn.target);
      return acc;
    }, {});

    let cursor = workflow.startNodeId;
    let previousResult = input;

    await this.executionRepository.update(executionId, {
      status: 'running',
      startedAt: new Date().toISOString()
    });

    while (cursor) {
      const currentNode = nodeMap.get(cursor);
      const nodeImpl = this.nodeRegistry.get(currentNode.type);
      const result = await nodeImpl.execute({ node: currentNode, input, previousResult });

      await this.logRepository.create(`${executionId}_${cursor}_${Date.now()}`, {
        executionId,
        workflowId: workflow.id,
        nodeId: cursor,
        ...createLog('info', `Executed node ${currentNode.type}`, { result })
      });

      if (currentNode.type === 'ifCondition') {
        const branch = currentNode.parameters.trueTarget;
        const falseBranch = currentNode.parameters.falseTarget;
        cursor = result.matched ? branch : falseBranch;
      } else {
        cursor = outbound[cursor]?.[0] || null;
      }
      previousResult = result;
    }

    await this.executionRepository.update(executionId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      output: previousResult
    });

    return previousResult;
  }
}
