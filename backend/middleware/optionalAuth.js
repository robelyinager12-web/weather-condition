const { verifyAccessToken } = require('../utils/jwt');

// Weather lookups are public, but if the caller is logged in we still want
// to log the search to their history — this attaches req.user when possible
// without blocking anonymous requests.
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    req.user = verifyAccessToken(token);
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
}

module.exports = { optionalAuth };