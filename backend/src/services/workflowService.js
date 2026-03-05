const db = require('../db/firestore');

const workflows = db.collection('workflows');

async function createWorkflow(payload) {
  const doc = await workflows.add({ ...payload, createdAt: Date.now(), updatedAt: Date.now() });
  return { id: doc.id, ...payload };
}

async function updateWorkflow(id, payload) {
  await workflows.doc(id).update({ ...payload, updatedAt: Date.now() });
  return { id, ...payload };
}

async function getWorkflowById(id) {
  const doc = await workflows.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = { createWorkflow, updateWorkflow, getWorkflowById };
