const { db } = require('../../config/firebase');

async function listExecutionsController(req, res, next) {
  try {
    const snapshot = await db
      .collection('executions')
      .where('workflowId', '==', req.params.workflowId)
      .orderBy('startedAt', 'desc')
      .limit(50)
      .get();

    const data = snapshot.docs.map((doc) => doc.data());
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { listExecutionsController };
