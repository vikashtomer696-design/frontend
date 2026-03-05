const db = require('../db/firestore');
const { encrypt, decrypt } = require('../utils/encryption');

const credentialsCollection = db.collection('credentials');

async function storeCredential(userId, name, values) {
  const encryptedPayload = encrypt(JSON.stringify(values));
  const doc = await credentialsCollection.add({ userId, name, encryptedPayload, createdAt: Date.now() });
  return { id: doc.id, userId, name };
}

async function resolveCredentials(userId, names = []) {
  if (!names.length) return {};
  const snap = await credentialsCollection.where('userId', '==', userId).get();
  const map = {};
  snap.docs.forEach((doc) => {
    const data = doc.data();
    if (names.includes(data.name)) {
      map[data.name] = JSON.parse(decrypt(data.encryptedPayload));
    }
  });
  return map;
}

module.exports = { storeCredential, resolveCredentials };
