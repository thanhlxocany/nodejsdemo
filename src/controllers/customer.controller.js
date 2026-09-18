const customerService = require('../services/customer.service');
const response = require('../utils/response');

class CustomerController {
  async getAll(req, res) {
    response.success(res, await customerService.getAll(req.query));
  }

  async getSummary(req, res) {
    response.success(res, await customerService.getSummary());
  }

  async getById(req, res) {
    response.success(res, await customerService.getById(req.params.id));
  }

  async create(req, res) {
    const customer = await customerService.create(req.body);
    response.success(res, customer, 'Tạo khách hàng thành công', 201);
  }
}

module.exports = new CustomerController();
