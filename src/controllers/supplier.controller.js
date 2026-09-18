const supplierService = require('../services/supplier.service');
const response = require('../utils/response');

class SupplierController {
  async getAll(req, res) {
    response.success(res, await supplierService.getAll(req.query));
  }

  async getSummary(req, res) {
    response.success(res, await supplierService.getSummary());
  }

  async getById(req, res) {
    response.success(res, await supplierService.getById(req.params.id));
  }

  async create(req, res) {
    const supplier = await supplierService.create(req.body);
    response.success(res, supplier, 'Tạo nhà cung cấp thành công', 201);
  }
}

module.exports = new SupplierController();
