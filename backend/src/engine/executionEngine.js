const { getNode } = require('../nodes/core/nodeRegistry');
const workflowService = require('../services/workflowService');
const executionService = require('../services/executionService');
const credentialService = require('../services/credentialService');

function buildNodeMap(nodes = []) {
  const map = new Map();
  nodes.forEach((n) => map.set(n.id, n));
  return map;
}

function getNextNodeId(connections = [], currentId, branch = null) {
  const candidate = connections.find((conn) => {
    if (conn.from !== currentId) return false;
    if (!conn.condition) return true;
    return branch && conn.condition === branch;
  });
  return candidate ? candidate.to : null;
}

async function runWorkflow({ workflowId, trigger = { method: 'MANUAL' }, input = {} }) {
  const workflow = await workflowService.getWorkflowById(workflowId);
  if (!workflow || !workflow.definition) {
    throw new Error('Workflow not found or malformed');
  }

  const execution = await executionService.createExecutionStart(workflowId, trigger);
  const nodeMap = buildNodeMap(workflow.definition.nodes);
  const connections = workflow.definition.connections || [];

  const credentialNames = workflow.requiredCredentials || [];
  const credentials = await credentialService.resolveCredentials(workflow.userId, credentialNames);

  let currentNodeId = workflow.definition.startNodeId;
  let previousOutput = input;

  try {
    while (currentNodeId) {
      const nodeDef = nodeMap.get(currentNodeId);
      if (!nodeDef) throw new Error(`Node not found: ${currentNodeId}`);

      const node = getNode(nodeDef.type);
      const output = await node.execute(
        { input: previousOutput, trigger, credentials },
        nodeDef.parameters || {}
      );

      await executionService.appendExecutionResult(execution.id, {
        nodeId: nodeDef.id,
        nodeType: nodeDef.type,
        output,
        createdAt: Date.now()
      });

      await executionService.addLog(execution.id, 'info', `Node ${nodeDef.id} executed`, {
        nodeType: nodeDef.type
      });

      const branch = output && output.branch ? output.branch : null;
      currentNodeId = getNextNodeId(connections, currentNodeId, branch);
      previousOutput = output;
    }

    await executionService.completeExecution(execution.id, 'success');
    return { executionId: execution.id, status: 'success' };
  } catch (error) {
    await executionService.addLog(execution.id, 'error', error.message);
    await executionService.completeExecution(execution.id, 'failed', error.message);
    throw error;
  }
}

module.exports = { runWorkflow };
