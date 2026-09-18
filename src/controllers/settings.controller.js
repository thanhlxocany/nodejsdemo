const storeService = require('../services/store.service');
const staffService = require('../services/staff.service');
const response = require('../utils/response');

class SettingsController {
  async getStore(req, res) {
    response.success(res, await storeService.getInfo());
  }

  async updateStore(req, res) {
    response.success(res, await storeService.update(req.body), 'Cập nhật thành công');
  }

  async getStaff(req, res) {
    response.success(res, await staffService.getAll());
  }

  async createStaff(req, res) {
    const staff = await staffService.create(req.body);
    response.success(res, staff, 'Thêm nhân viên thành công', 201);
  }
}

module.exports = new SettingsController();
