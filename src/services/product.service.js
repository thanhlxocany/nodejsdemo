const Product = require('../models/product.model');
const httpError = require('../utils/httpError');
const { searchRegex } = require('../utils/query');

function toDto(product) {
  return {
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    categoryId: product.category._id.toString(),
    categoryName: product.category.name,
    costPrice: product.costPrice,
    sellPrice: product.sellPrice,
    vatPercent: product.vatPercent,
    unit: product.unit,
    stockQty: product.stockQty,
    minStock: product.minStock,
    description: product.description,
    imageUrl: product.imageUrl,
    status: product.status,
    updatedAt: product.updatedAt
  };
}

function toModelData({ categoryId, ...rest }) {
  return categoryId ? { ...rest, category: categoryId } : rest;
}

async function findOrFail(id) {
  // SELECT p.*, c.* FROM products p JOIN categories c ON c._id = p.category WHERE p._id = id;
  const product = await Product.findById(id).populate('category');
  if (!product) throw httpError(404, 'Không tìm thấy sản phẩm');
  return product;
}

async function getAll({ search, categoryId, status }) {
  const filter = {};
  if (categoryId) filter.category = categoryId;
  if (status) filter.status = status;
  if (search) {
    const regex = searchRegex(search);
    filter.$or = [{ name: regex }, { sku: regex }, { barcode: regex }];
  }
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  return products.map(toDto);
}

async function getSummary() {
  const [total, active, inactive, lowStock] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: 'active' }),
    Product.countDocuments({ status: 'inactive' }),
    Product.countDocuments({ $expr: { $lte: ['$stockQty', '$minStock'] } })
  ]);
  return { total, active, lowStock, inactive };
}

async function getById(id) {
  return toDto(await findOrFail(id));
}

async function create(data) {
  // INSERT INTO products (...) VALUES (...);
  const product = await Product.create(toModelData(data));
  return getById(product.id);
}

async function update(id, data) {
  // UPDATE products SET ... WHERE _id = id;
  const product = await Product.findByIdAndUpdate(id, toModelData(data), {
    new: true,
    runValidators: true
  });
  if (!product) throw httpError(404, 'Không tìm thấy sản phẩm');
  return getById(id);
}

async function remove(id) {
  // DELETE FROM products WHERE _id = id;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw httpError(404, 'Không tìm thấy sản phẩm');
}

module.exports = { getAll, getSummary, getById, create, update, remove };
