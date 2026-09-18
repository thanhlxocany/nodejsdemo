const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const generateCode = require('../utils/generateCode');
const httpError = require('../utils/httpError');
const ORDER_STATUS_LABEL = require('../utils/orderStatus');
const { searchRegex, startOfDay } = require('../utils/query');

async function getStatsMap() {
  // SELECT customer, SUM(total), COUNT(*) FROM orders WHERE status = 'completed' GROUP BY customer;
  const stats = await Order.aggregate([
    { $match: { customer: { $ne: null }, status: 'completed' } },
    { $group: { _id: '$customer', totalSpent: { $sum: '$total' }, ordersCount: { $sum: 1 } } }
  ]);
  return new Map(stats.map((s) => [s._id.toString(), s]));
}

async function toDto(customer, stats) {
  const recentOrders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(5);
  return {
    id: customer.id,
    code: customer.code,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    tier: customer.tier,
    points: customer.points,
    totalSpent: stats?.totalSpent || 0,
    ordersCount: stats?.ordersCount || 0,
    status: customer.status,
    joinedAt: customer.createdAt,
    note: customer.note,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      code: order.code,
      total: order.total,
      statusLabel: ORDER_STATUS_LABEL[order.status]
    }))
  };
}

async function getAll({ search, tier }) {
  const filter = {};
  if (tier) filter.tier = tier;
  if (search) {
    const regex = searchRegex(search);
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }, { code: regex }];
  }
  const [customers, statsMap] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }),
    getStatsMap()
  ]);
  return Promise.all(customers.map((c) => toDto(c, statsMap.get(c.id))));
}

async function getSummary() {
  const [total, loyal, newThisMonth, memberRevenue] = await Promise.all([
    Customer.countDocuments(),
    Customer.countDocuments({ tier: { $ne: 'thuong' } }),
    Customer.countDocuments({ createdAt: { $gte: startOfMonth() } }),
    Order.aggregate([
      { $match: { customer: { $ne: null }, status: 'completed' } },
      { $group: { _id: null, revenue: { $sum: '$total' } } }
    ])
  ]);
  return { total, loyal, newThisMonth, memberRevenue: memberRevenue[0]?.revenue || 0 };
}

function startOfMonth() {
  const now = new Date();
  return startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
}

async function getById(id) {
  const customer = await Customer.findById(id);
  if (!customer) throw httpError(404, 'Không tìm thấy khách hàng');
  const statsMap = await getStatsMap();
  return toDto(customer, statsMap.get(customer.id));
}

async function create(data) {
  const code = await generateCode(Customer, 'KH');
  // INSERT INTO customers (...) VALUES (...);
  const customer = await Customer.create({ ...data, code });
  return toDto(customer);
}

module.exports = { getAll, getSummary, getById, create };
