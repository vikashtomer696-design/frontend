const db = require('../db/firestore');

const executions = db.collection('executions');
const logs = db.collection('logs');

async function createExecutionStart(workflowId, trigger) {
  const payload = {
    workflowId,
    status: 'running',
    startedAt: Date.now(),
    trigger,
    results: []
  };
  const doc = await executions.add(payload);
  return { id: doc.id, ...payload };
}

async function appendExecutionResult(executionId, nodeResult) {
  await executions.doc(executionId).update({
    results: require('firebase-admin').firestore.FieldValue.arrayUnion(nodeResult)
  });
}

async function completeExecution(executionId, status, error = null) {
  await executions.doc(executionId).update({
    status,
    error,
    endedAt: Date.now()
  });
}

async function addLog(executionId, level, message, meta = null) {
  await logs.add({ executionId, level, message, meta, createdAt: Date.now() });
}

async function listExecutions(workflowId) {
  const query = workflowId
    ? executions.where('workflowId', '==', workflowId)
    : executions;
  const snap = await query.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getExecutionById(id) {
  const doc = await executions.doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function fetchLogs(executionId) {
  const snap = await logs.where('executionId', '==', executionId).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  createExecutionStart,
  appendExecutionResult,
  completeExecution,
  addLog,
  listExecutions,
  getExecutionById,
  fetchLogs
};
