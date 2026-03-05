const { db, admin } = require('../config/firebase');
const { createNode } = require('../nodes/nodeRegistry');

function getStartNode(workflow) {
  return workflow.nodes.find((node) => node.type === 'webhookTrigger') || workflow.nodes[0];
}

function getNextNode(currentNodeId, workflow) {
  const edge = workflow.connections.find((connection) => connection.source === currentNodeId);
  if (!edge) {
    return null;
  }
  return workflow.nodes.find((node) => node.id === edge.target) || null;
}

async function executeWorkflow(workflow, payload = {}) {
  const executionRef = db.collection('executions').doc();
  const logs = [];

  await executionRef.set({
    id: executionRef.id,
    workflowId: workflow.id,
    status: 'running',
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
    input: payload,
  });

  let currentNode = getStartNode(workflow);
  let data = payload;

  while (currentNode) {
    const node = createNode(currentNode);
    const startedAt = Date.now();

    data = await node.execute({ data, input: payload, workflow });

    logs.push({
      nodeId: currentNode.id,
      nodeType: currentNode.type,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      output: data,
    });

    await db.collection('logs').add({
      executionId: executionRef.id,
      workflowId: workflow.id,
      nodeId: currentNode.id,
      output: data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    currentNode = getNextNode(currentNode.id, workflow);
  }

  await executionRef.update({
    status: 'completed',
    finishedAt: admin.firestore.FieldValue.serverTimestamp(),
    output: data,
  });

  return { executionId: executionRef.id, output: data, logs };
}

module.exports = { executeWorkflow };
