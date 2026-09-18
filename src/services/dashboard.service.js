const Product = require('../models/product.model');
const buildDelta = require('../utils/delta');
const reportService = require('./report.service');
const { startOfDay, endOfDay } = require('../utils/query');

const DAY_MS = 24 * 60 * 60 * 1000;

async function getSummary() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - DAY_MS);
  const weekStart = startOfDay(new Date(now.getTime() - 6 * DAY_MS));
  const lowStockFilter = { $expr: { $lte: ['$stockQty', '$minStock'] } };

  const [today, previousDay, revenueTrend, lowStockCount, lowStockProducts] = await Promise.all([
    reportService.getTotals(startOfDay(now), endOfDay(now)),
    reportService.getTotals(startOfDay(yesterday), endOfDay(yesterday)),
    reportService.getDailyRevenue(weekStart, endOfDay(now)),
    Product.countDocuments(lowStockFilter),
    Product.find(lowStockFilter).sort({ stockQty: 1 }).limit(5)
  ]);

  const vsYesterday = 'so voi hom qua';
  return {
    revenueToday: today.revenue,
    revenueDelta: buildDelta(today.revenue, previousDay.revenue, vsYesterday),
    ordersToday: today.orders,
    ordersDelta: buildDelta(today.orders, previousDay.orders, vsYesterday),
    profitToday: today.profit,
    profitDelta: buildDelta(today.profit, previousDay.profit, vsYesterday),
    lowStockCount,
    lowStockDelta: {
      text: lowStockCount > 0 ? 'Can nhap them hang' : 'Ton kho on dinh',
      tone: lowStockCount > 0 ? 'negative' : 'neutral'
    },
    weekRevenue: revenueTrend.reduce((sum, point) => sum + point.revenue, 0),
    revenueTrend,
    lowStockProducts: lowStockProducts.map((p) => ({ id: p.id, name: p.name, stockQty: p.stockQty }))
  };
}

module.exports = { getSummary };
