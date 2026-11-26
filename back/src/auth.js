const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret-de-dev';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '2h' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Non connecté' });
  }
}

module.exports = { signToken, requireAuth };
