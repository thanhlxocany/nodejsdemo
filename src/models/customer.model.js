const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    tier: { type: String, enum: ['thuong', 'bac', 'vang', 'kim_cuong'], default: 'thuong' },
    points: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    note: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
