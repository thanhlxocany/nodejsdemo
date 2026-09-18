const Order = require('../models/order.model');
const Product = require('../models/product.model');

// Ban dung standalone MongoDB (khong replica set) nen khong dung transaction o day.
// Neu can dam bao atomic tuyet doi, can cau hinh MongoDB replica set roi dung session/transaction.
async function createOrder({ items, createdBy }) {
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    // SELECT * FROM products WHERE _id = item.product LIMIT 1;
    const product = await Product.findById(item.product);
    if (!product) {
      const error = new Error(`San pham khong ton tai: ${item.product}`);
      error.status = 400;
      throw error;
    }
    if (product.stock < item.quantity) {
      const error = new Error(`San pham "${product.name}" khong du ton kho`);
      error.status = 400;
      throw error;
    }

    product.stock -= item.quantity;
    // UPDATE products SET stock = stock - item.quantity WHERE _id = product._id;
    await product.save();

    orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
    totalAmount += product.price * item.quantity;
  }

  // INSERT INTO orders (items, total_amount, created_by) VALUES (orderItems, totalAmount, createdBy);
  return Order.create({ items: orderItems, totalAmount, createdBy });
}

function getAll() {
  // SELECT o.*, p.* FROM orders o
  // JOIN products p ON p._id = o.items.product   -- populate = JOIN
  // ORDER BY o.created_at DESC;
  return Order.find().populate('items.product').sort({ createdAt: -1 });
}

function getById(id) {
  // SELECT o.*, p.* FROM orders o
  // JOIN products p ON p._id = o.items.product   -- populate = JOIN
  // WHERE o._id = id LIMIT 1;
  return Order.findById(id).populate('items.product');
}

module.exports = { createOrder, getAll, getById };
