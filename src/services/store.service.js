const Store = require('../models/store.model');

const STORE_FIELDS = ['name', 'phone', 'address', 'taxCode', 'currency', 'timezone'];

function toDto(store) {
  return Object.fromEntries(STORE_FIELDS.map((field) => [field, store[field]]));
}

async function getInfo() {
  const store = (await Store.findOne()) || (await Store.create({}));
  return toDto(store);
}

async function update(data) {
  const store = (await Store.findOne()) || new Store();
  store.set(data);
  await store.save();
  return toDto(store);
}

module.exports = { getInfo, update };
