const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactName: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    categoryLabel: { type: String, default: '' },
    debt: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'paused', 'new'], default: 'new' },
    paymentTerm: { type: String, default: 'Thanh toán sau 30 ngày' },
    paymentDueDays: { type: Number, default: 30, min: 0 },
    discountNote: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
