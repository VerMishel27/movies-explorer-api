const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV !== 'production' ? 'dev_secret' : JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  generateToken,
};
