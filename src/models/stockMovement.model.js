const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    type: { type: String, enum: ['in', 'out', 'adjust'], required: true },
    quantity: { type: Number, required: true, min: 0 },
    reason: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);
