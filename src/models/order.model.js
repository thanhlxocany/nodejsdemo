const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    categoryName: { type: String, default: '' },
    unitPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, default: 0, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    customerName: { type: String, default: 'Khách lẻ' },
    customerPhone: { type: String, default: '' },
    channel: { type: String, default: 'POS' },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    vatPercent: { type: Number, default: 0, min: 0 },
    vat: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['cash', 'transfer', 'card'], default: 'cash' },
    paid: { type: Boolean, default: true },
    status: { type: String, enum: ['completed', 'processing', 'cancelled'], default: 'completed' },
    note: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
