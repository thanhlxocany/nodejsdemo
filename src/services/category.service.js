const Category = require('../models/category.model');

function getAll() {
  // SELECT * FROM categories ORDER BY created_at DESC;
  return Category.find().sort({ createdAt: -1 });
}

function getById(id) {
  // SELECT * FROM categories WHERE _id = id LIMIT 1;
  return Category.findById(id);
}

function create(data) {
  // INSERT INTO categories (...) VALUES (...);
  return Category.create(data);
}

function update(id, data) {
  // UPDATE categories SET ... WHERE _id = id;  (rồi SELECT lại vì new: true)
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

function remove(id) {
  // DELETE FROM categories WHERE _id = id;
  return Category.findByIdAndDelete(id);
}

module.exports = { getAll, getById, create, update, remove };
