const admin = require('firebase-admin');

function initializeFirebase() {
  if (admin.apps.length) {
    return admin.firestore();
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

  return admin.firestore();
}

const db = initializeFirebase();

module.exports = { db, admin };
