const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');
const StockMovement = require('../models/stockMovement.model');
const generateCode = require('../utils/generateCode');
const httpError = require('../utils/httpError');
const { searchRegex, dateRangeFilter, formatDateTime } = require('../utils/query');

function buildTimeline(order) {
  const completed = order.status === 'completed';
  const timeline = [
    { label: 'Tạo đơn hàng', time: formatDateTime(order.createdAt), done: true },
    { label: 'Thanh toán', time: order.paid ? formatDateTime(order.createdAt) : null, done: order.paid },
    { label: 'Hoàn thành', time: completed ? formatDateTime(order.updatedAt) : null, done: completed }
  ];
  if (order.status === 'cancelled') {
    timeline.push({ label: 'Đã hủy / hoàn tiền', time: formatDateTime(order.updatedAt), done: true });
  }
  return timeline;
}

function toDto(order) {
  return {
    id: order.id,
    code: order.code,
    createdAt: order.createdAt,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerTier: order.customer?.tier || null,
    channel: order.channel,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items.map((item) => ({
      productId: item.product.toString(),
      name: item.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    vat: order.vat,
    total: order.total,
    paid: order.paid,
    paymentMethod: order.paymentMethod,
    status: order.status,
    timeline: buildTimeline(order),
    note: order.note
  };
}

async function findOrFail(id) {
  // SELECT o.*, c.tier FROM orders o LEFT JOIN customers c ON c._id = o.customer WHERE o._id = id;
  const order = await Order.findById(id).populate('customer', 'tier');
  if (!order) throw httpError(404, 'Không tìm thấy hóa đơn');
  return order;
}

async function createOrder({ items, paymentMethod, vatPercent = 0, customerId, createdBy }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw httpError(400, 'Hóa đơn phải có ít nhất 1 sản phẩm');
  }

  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId).populate('category');
    if (!product) throw httpError(400, `Sản phẩm không tồn tại: ${item.productId}`);
    if (product.status !== 'active') throw httpError(400, `Sản phẩm "${product.name}" đã ngừng bán`);
    if (product.stockQty < item.quantity) {
      throw httpError(400, `Sản phẩm "${product.name}" không đủ tồn kho`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      categoryName: product.category.name,
      unitPrice: product.sellPrice,
      costPrice: product.costPrice,
      quantity: item.quantity
    });
  }

  const customer = customerId ? await Customer.findById(customerId) : null;
  const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const vat = Math.round((subtotal * vatPercent) / 100);
  const code = await generateCode(Order, 'DH');

  const order = await Order.create({
    code,
    customer: customer?._id || null,
    customerName: customer?.name || 'Khách lẻ',
    customerPhone: customer?.phone || '',
    items: orderItems,
    subtotal,
    vatPercent,
    vat,
    total: subtotal + vat,
    paymentMethod,
    createdBy
  });

  for (const item of orderItems) {
    // UPDATE products SET stockQty = stockQty - quantity WHERE _id = item.product;
    await Product.updateOne({ _id: item.product }, { $inc: { stockQty: -item.quantity } });
    await StockMovement.create({
      product: item.product,
      productName: item.name,
      type: 'out',
      quantity: item.quantity,
      reason: `Bán hàng đơn ${code}`
    });
  }

  return { orderId: order.id, code: order.code };
}

async function getAll({ search, status, from, to }) {
  const filter = {};
  if (status) filter.status = status;
  if (from || to) filter.createdAt = dateRangeFilter(from, to);
  if (search) {
    const regex = searchRegex(search);
    filter.$or = [{ code: regex }, { customerName: regex }, { customerPhone: regex }];
  }
  const orders = await Order.find(filter).populate('customer', 'tier').sort({ createdAt: -1 });
  return orders.map(toDto);
}

async function getSummary() {
  // SELECT status, COUNT(*) FROM orders GROUP BY status;
  const counts = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const byStatus = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  const completed = byStatus.completed || 0;
  const processing = byStatus.processing || 0;
  const cancelled = byStatus.cancelled || 0;
  return { total: completed + processing + cancelled, completed, processing, cancelled };
}

async function getById(id) {
  return toDto(await findOrFail(id));
}

async function cancel(order) {
  for (const item of order.items) {
    await Product.updateOne({ _id: item.product }, { $inc: { stockQty: item.quantity } });
    await StockMovement.create({
      product: item.product,
      productName: item.name,
      type: 'in',
      quantity: item.quantity,
      reason: `Hoàn hàng đơn ${order.code}`
    });
  }
  order.status = 'cancelled';
  order.paid = false;
  await order.save();
}

async function updateStatus(id, status) {
  const order = await findOrFail(id);
  if (order.status === 'cancelled') throw httpError(400, 'Đơn hàng đã hủy, không thể đổi trạng thái');
  if (status === 'cancelled') {
    await cancel(order);
  } else {
    order.status = status;
    await order.save();
  }
  return toDto(order);
}

async function refund(id) {
  const order = await findOrFail(id);
  if (order.status !== 'completed' || !order.paid) {
    throw httpError(400, 'Chỉ hoàn tiền được đơn hàng đã hoàn thành và đã thanh toán');
  }
  await cancel(order);
  return toDto(order);
}

module.exports = { createOrder, getAll, getSummary, getById, updateStatus, refund };
