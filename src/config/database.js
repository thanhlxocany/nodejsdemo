const mongoose = require('mongoose');
const env = require('./env');

async function connect() {
  try {
    const res = await mongoose.connect(env.mongoUri);
    console.log('Ket noi MongoDB thanh cong');
  } catch (error) {
    console.error('Ket noi MongoDB that bai:', error.message);
  }
}

module.exports = { connect };
