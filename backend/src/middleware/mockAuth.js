function mockAuth(req, _res, next) {
  req.user = { id: req.header('x-user-id') || 'demo-user' };
  next();
}

module.exports = { mockAuth };
