const jwt = require('jsonwebtoken');
const env = require('../config/env');

function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
}

module.exports = auth;
