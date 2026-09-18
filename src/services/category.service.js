const Category = require('../models/category.model');
const Product = require('../models/product.model');
const httpError = require('../utils/httpError');

async function getStatsMap() {
  // SELECT category, COUNT(*), SUM(stockQty <= minStock), SUM(stockQty * costPrice)
  // FROM products GROUP BY category;
  const stats = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        productCount: { $sum: 1 },
        lowStockCount: { $sum: { $cond: [{ $lte: ['$stockQty', '$minStock'] }, 1, 0] } },
        totalValue: { $sum: { $multiply: ['$stockQty', '$costPrice'] } }
      }
    }
  ]);
  return new Map(stats.map((s) => [s._id.toString(), s]));
}

function toDto(category, stats) {
  return {
    id: category.id,
    code: category.code,
    name: category.name,
    description: category.description,
    status: category.status,
    productCount: stats?.productCount || 0,
    lowStockCount: stats?.lowStockCount || 0,
    totalValue: stats?.totalValue || 0
  };
}

async function findOrFail(id) {
  const category = await Category.findById(id);
  if (!category) throw httpError(404, 'Không tìm thấy danh mục');
  return category;
}

async function getAll() {
  // SELECT * FROM categories ORDER BY created_at DESC;
  const [categories, statsMap] = await Promise.all([
    Category.find().sort({ createdAt: -1 }),
    getStatsMap()
  ]);
  return categories.map((c) => toDto(c, statsMap.get(c.id)));
}

async function getById(id) {
  const [category, statsMap] = await Promise.all([findOrFail(id), getStatsMap()]);
  return toDto(category, statsMap.get(category.id));
}

async function create(data) {
  // INSERT INTO categories (...) VALUES (...);
  const category = await Category.create(data);
  return toDto(category);
}

async function update(id, data) {
  // UPDATE categories SET ... WHERE _id = id;
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw httpError(404, 'Không tìm thấy danh mục');
  return getById(id);
}

async function remove(id) {
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) throw httpError(400, 'Danh mục đang có sản phẩm, không thể xóa');
  // DELETE FROM categories WHERE _id = id;
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw httpError(404, 'Không tìm thấy danh mục');
}

module.exports = { getAll, getById, create, update, remove };
