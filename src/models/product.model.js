const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, default: '' },
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    costPrice: { type: Number, required: true, min: 0, default: 0 },
    sellPrice: { type: Number, required: true, min: 0 },
    vatPercent: { type: Number, min: 0, default: 0 },
    unit: { type: String, default: 'cai' },
    stockQty: { type: Number, required: true, min: 0, default: 0 },
    minStock: { type: Number, min: 0, default: 0 },
    warehouse: { type: String, default: 'Kho chính' },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
