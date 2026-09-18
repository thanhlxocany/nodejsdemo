const Product = require('../models/product.model');
const StockMovement = require('../models/stockMovement.model');
const httpError = require('../utils/httpError');
const { searchRegex, startOfDay } = require('../utils/query');

function getStockStatus(product) {
  if (product.stockQty === 0) return 'out';
  return product.stockQty <= product.minStock ? 'low' : 'normal';
}

function toItemDto(product) {
  return {
    id: product.id,
    productId: product.id,
    sku: product.sku,
    name: product.name,
    warehouse: product.warehouse,
    stockQty: product.stockQty,
    minStock: product.minStock,
    value: product.stockQty * product.costPrice,
    status: getStockStatus(product)
  };
}

function toMovementDto(movement) {
  return {
    id: movement.id,
    type: movement.type,
    productName: movement.productName,
    quantity: movement.quantity,
    createdAt: movement.createdAt
  };
}

const STATUS_FILTER = {
  out: { stockQty: 0 },
  low: { stockQty: { $gt: 0 }, $expr: { $lte: ['$stockQty', '$minStock'] } },
  normal: { $expr: { $gt: ['$stockQty', '$minStock'] } }
};

async function getAll({ search, warehouse, status }) {
  const filter = { ...STATUS_FILTER[status] };
  if (warehouse) filter.warehouse = warehouse;
  if (search) {
    const regex = searchRegex(search);
    filter.$or = [{ name: regex }, { sku: regex }];
  }
  const products = await Product.find(filter).sort({ name: 1 });
  return products.map(toItemDto);
}

async function getSummary() {
  const today = { createdAt: { $gte: startOfDay(new Date()) } };
  const [stock, lowStock, received, adjustments] = await Promise.all([
    Product.aggregate([{ $group: { _id: null, totalStock: { $sum: '$stockQty' } } }]),
    Product.countDocuments({ $expr: { $lte: ['$stockQty', '$minStock'] } }),
    StockMovement.aggregate([
      { $match: { type: 'in', ...today } },
      { $group: { _id: null, quantity: { $sum: '$quantity' } } }
    ]),
    StockMovement.countDocuments({ type: 'adjust', ...today })
  ]);
  return {
    totalStock: stock[0]?.totalStock || 0,
    lowStock,
    receivedToday: received[0]?.quantity || 0,
    adjustments
  };
}

async function getMovements() {
  const movements = await StockMovement.find().sort({ createdAt: -1 }).limit(20);
  return movements.map(toMovementDto);
}

async function createAdjustment({ productId, type, quantity, reason }) {
  const product = await Product.findById(productId);
  if (!product) throw httpError(404, 'Không tìm thấy sản phẩm');
  if (!(quantity >= 0)) throw httpError(400, 'Số lượng không hợp lệ');

  let newQty;
  if (type === 'in') newQty = product.stockQty + quantity;
  else if (type === 'out') newQty = product.stockQty - quantity;
  else if (type === 'adjust') newQty = quantity;
  else throw httpError(400, 'Loại điều chỉnh không hợp lệ');

  if (newQty < 0) throw httpError(400, 'Tồn kho không đủ để xuất');

  product.stockQty = newQty;
  await product.save();

  const movement = await StockMovement.create({
    product: product._id,
    productName: product.name,
    type,
    quantity,
    reason
  });
  return toMovementDto(movement);
}

module.exports = { getAll, getSummary, getMovements, createAdjustment };
