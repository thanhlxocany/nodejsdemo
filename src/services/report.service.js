const Order = require('../models/order.model');
const buildDelta = require('../utils/delta');
const { startOfDay, endOfDay } = require('../utils/query');

const DAY_MS = 24 * 60 * 60 * 1000;

function resolveRange({ from, to }) {
  const end = endOfDay(to || new Date());
  const start = startOfDay(from || new Date(end.getTime() - 6 * DAY_MS));
  return { start, end };
}

const profitExpr = {
  $sum: {
    $map: {
      input: '$items',
      as: 'item',
      in: { $multiply: [{ $subtract: ['$$item.unitPrice', '$$item.costPrice'] }, '$$item.quantity'] }
    }
  }
};

async function getTotals(start, end) {
  // SELECT SUM(total), SUM(profit), COUNT(*) FROM orders WHERE status = 'completed' AND created_at BETWEEN start AND end;
  const [totals] = await Order.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, revenue: { $sum: '$total' }, profit: { $sum: profitExpr }, orders: { $sum: 1 } } }
  ]);
  return totals || { revenue: 0, profit: 0, orders: 0 };
}

async function getDailyRevenue(start, end) {
  const rows = await Order.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' } } }
  ]);
  const revenueByDay = new Map(rows.map((r) => [r._id, r.revenue]));

  const trend = [];
  for (let day = startOfDay(start); day <= end; day = new Date(day.getTime() + DAY_MS)) {
    const key = [day.getFullYear(), String(day.getMonth() + 1).padStart(2, '0'), String(day.getDate()).padStart(2, '0')].join('-');
    trend.push({ label: `${day.getDate()}/${day.getMonth() + 1}`, revenue: revenueByDay.get(key) || 0 });
  }
  return trend;
}

async function getRevenueByProduct(start, end) {
  const rows = await Order.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
  return rows;
}

async function getRevenueByCategory(start, end) {
  return Order.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: start, $lte: end } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.categoryName',
        revenue: { $sum: { $multiply: ['$items.unitPrice', '$items.quantity'] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
}

function growthText(current, previous) {
  return buildDelta(current, previous, '').text.trim();
}

async function getSummary(query) {
  const { start, end } = resolveRange(query);
  const length = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - length);

  const [current, previous, revenueTrend, products, previousProducts, categories] = await Promise.all([
    getTotals(start, end),
    getTotals(prevStart, prevEnd),
    getDailyRevenue(start, end),
    getRevenueByProduct(start, end),
    getRevenueByProduct(prevStart, prevEnd),
    getRevenueByCategory(start, end)
  ]);

  const margin = current.revenue ? (current.profit / current.revenue) * 100 : 0;
  const prevMargin = previous.revenue ? (previous.profit / previous.revenue) * 100 : 0;
  const avgOrderValue = current.orders ? Math.round(current.revenue / current.orders) : 0;
  const prevAvgOrderValue = previous.orders ? Math.round(previous.revenue / previous.orders) : 0;
  const previousRevenueMap = new Map(previousProducts.map((p) => [p._id.toString(), p.revenue]));
  const totalCategoryRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);

  return {
    revenue: current.revenue,
    revenueDelta: buildDelta(current.revenue, previous.revenue),
    profit: current.profit,
    profitDelta: buildDelta(current.profit, previous.profit),
    marginText: `${margin.toFixed(1)}%`,
    marginDelta: buildDelta(margin, prevMargin),
    avgOrderValue,
    avgOrderDelta: buildDelta(avgOrderValue, prevAvgOrderValue),
    revenueTrend,
    topProducts: products.slice(0, 5).map((p) => ({
      id: p._id.toString(),
      name: p.name,
      unitsSold: p.unitsSold,
      revenue: p.revenue,
      growthText: growthText(p.revenue, previousRevenueMap.get(p._id.toString()) || 0)
    })),
    categoryBreakdown: categories.map((c) => ({
      name: c._id,
      percent: Math.round((c.revenue / totalCategoryRevenue) * 100)
    }))
  };
}

module.exports = { getSummary, getTotals, getDailyRevenue };
