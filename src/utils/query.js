function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchRegex(text) {
  return new RegExp(escapeRegex(text), 'i');
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function dateRangeFilter(from, to) {
  const range = {};
  if (from) range.$gte = startOfDay(from);
  if (to) range.$lte = endOfDay(to);
  return range;
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('vi-VN', { hour12: false });
}

module.exports = { searchRegex, startOfDay, endOfDay, dateRangeFilter, formatDateTime };
