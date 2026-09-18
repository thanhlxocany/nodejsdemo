const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Cửa hàng tạp hóa' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    taxCode: { type: String, default: '' },
    currency: { type: String, default: 'VND' },
    timezone: { type: String, default: 'Asia/Ho_Chi_Minh' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
