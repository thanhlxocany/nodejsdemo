const Product = require('../models/product.model');

function getAll() {
  // SELECT p.*, c.* FROM products p
  // JOIN categories c ON c._id = p.category   -- populate = JOIN
  // ORDER BY p.created_at DESC;
  return Product.find().populate('category').sort({ createdAt: -1 });
}

function getById(id) {
  // SELECT p.*, c.* FROM products p
  // JOIN categories c ON c._id = p.category   -- populate = JOIN
  // WHERE p._id = id LIMIT 1;
  return Product.findById(id).populate('category');
}

function create(data) {
  // INSERT INTO products (...) VALUES (...);
  return Product.create(data);
}

function update(id, data) {
  // UPDATE products SET ... WHERE _id = id;  (rồi SELECT lại vì new: true)
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function remove(id) {
  // DELETE FROM products WHERE _id = id;
  return Product.findByIdAndDelete(id);
}

module.exports = { getAll, getById, create, update, remove };
