const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../config/env');

async function register({ name, email, password }) {
  // SELECT * FROM users WHERE email = email LIMIT 1;
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email đã được sử dụng');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // INSERT INTO users (name, email, password) VALUES (name, email, hashedPassword);
  const user = await User.create({ name, email, password: hashedPassword });

  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function login({ email, password }) {
  // SELECT * FROM users WHERE email = email LIMIT 1;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Email hoặc mật khẩu không đúng');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Email hoặc mật khẩu không đúng');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}

async function getCurrentUser(id) {
  const user = await User.findById(id).select('-password');
  if (!user) {
    const error = new Error('Không tìm thấy người dùng');
    error.status = 404;
    throw error;
  }
  return user;
}

module.exports = { register, login, getCurrentUser };
