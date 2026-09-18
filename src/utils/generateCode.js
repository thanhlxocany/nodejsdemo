async function generateCode(Model, prefix) {
  // SELECT COUNT(*) FROM table;
  const count = await Model.countDocuments();
  return `${prefix}${String(count + 1).padStart(5, '0')}`;
}

module.exports = generateCode;
