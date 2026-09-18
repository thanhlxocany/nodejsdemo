const Supplier = require('../models/supplier.model');
const generateCode = require('../utils/generateCode');
const httpError = require('../utils/httpError');
const { searchRegex } = require('../utils/query');

function toDto(supplier) {
  return {
    id: supplier.id,
    code: supplier.code,
    name: supplier.name,
    contactName: supplier.contactName,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    categoryLabel: supplier.categoryLabel,
    debt: supplier.debt,
    status: supplier.status,
    paymentTerm: supplier.paymentTerm,
    paymentDueDays: supplier.paymentDueDays,
    discountNote: supplier.discountNote,
    recentPurchases: []
  };
}

async function getAll({ search, status }) {
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const regex = searchRegex(search);
    filter.$or = [{ name: regex }, { contactName: regex }, { phone: regex }, { code: regex }];
  }
  const suppliers = await Supplier.find(filter).sort({ createdAt: -1 });
  return suppliers.map(toDto);
}

async function getSummary() {
  const [total, active, debt] = await Promise.all([
    Supplier.countDocuments(),
    Supplier.countDocuments({ status: 'active' }),
    Supplier.aggregate([{ $group: { _id: null, totalDebt: { $sum: '$debt' } } }])
  ]);
  return { total, active, pendingPurchases: 0, totalDebt: debt[0]?.totalDebt || 0 };
}

async function getById(id) {
  const supplier = await Supplier.findById(id);
  if (!supplier) throw httpError(404, 'Không tìm thấy nhà cung cấp');
  return toDto(supplier);
}

async function create(data) {
  const code = await generateCode(Supplier, 'NCC');
  const supplier = await Supplier.create({ ...data, code });
  return toDto(supplier);
}

module.exports = { getAll, getSummary, getById, create };
