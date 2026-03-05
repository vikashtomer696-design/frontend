const { db, admin } = require('../config/firebase');
const { encrypt } = require('../config/encryption');

async function createWorkflow(payload, userId) {
  const workflowRef = db.collection('workflows').doc();
  const workflow = {
    id: workflowRef.id,
    userId,
    name: payload.name,
    nodes: payload.nodes,
    connections: payload.connections,
    active: payload.active ?? true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await workflowRef.set(workflow);
  return workflow;
}

async function updateWorkflow(workflowId, payload) {
  const workflowRef = db.collection('workflows').doc(workflowId);
  await workflowRef.update({
    ...payload,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const updated = await workflowRef.get();
  return updated.data();
}

async function getWorkflowById(workflowId) {
  const snapshot = await db.collection('workflows').doc(workflowId).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data();
}

async function storeCredential(userId, provider, secretPayload) {
  const encryptedPayload = encrypt(JSON.stringify(secretPayload));
  const credentialRef = db.collection('credentials').doc();
  const data = {
    id: credentialRef.id,
    userId,
    provider,
    encryptedPayload,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await credentialRef.set(data);
  return { id: credentialRef.id, provider };
}

module.exports = {
  createWorkflow,
  updateWorkflow,
  getWorkflowById,
  storeCredential,
};
