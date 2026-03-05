const { db } = require('../../config/firebase');

async function listLogsController(req, res, next) {
  try {
    const snapshot = await db
      .collection('logs')
      .where('executionId', '==', req.params.executionId)
      .orderBy('createdAt', 'asc')
      .get();

    res.json(snapshot.docs.map((doc) => doc.data()));
  } catch (error) {
    next(error);
  }
}

module.exports = { listLogsController };
