const inventoryService = require('../services/inventory.service');
const response = require('../utils/response');

class InventoryController {
  async getAll(req, res) {
    response.success(res, await inventoryService.getAll(req.query));
  }

  async getSummary(req, res) {
    response.success(res, await inventoryService.getSummary());
  }

  async getMovements(req, res) {
    response.success(res, await inventoryService.getMovements());
  }

  async createAdjustment(req, res) {
    const movement = await inventoryService.createAdjustment(req.body);
    response.success(res, movement, 'Điều chỉnh tồn kho thành công', 201);
  }
}

module.exports = new InventoryController();
