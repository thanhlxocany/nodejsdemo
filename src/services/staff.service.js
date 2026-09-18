const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const env = require('../config/env');
const httpError = require('../utils/httpError');

function toDto(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
}

async function getAll() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(toDto);
}

async function create({ name, email, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw httpError(400, 'Email đã được sử dụng');

  const password = await bcrypt.hash(env.defaultStaffPassword, 10);
  const user = await User.create({ name, email, role, password });
  return toDto(user);
}

module.exports = { getAll, create };
