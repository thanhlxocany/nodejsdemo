const orderService = require('../services/order.service');
const response = require('../utils/response');

class OrderController {
  async getAll(req, res) {
    response.success(res, await orderService.getAll(req.query));
  }

  async getSummary(req, res) {
    response.success(res, await orderService.getSummary());
  }

  async getById(req, res) {
    response.success(res, await orderService.getById(req.params.id));
  }

  async create(req, res) {
    const result = await orderService.createOrder({ ...req.body, createdBy: req.user.id });
    response.success(res, result, 'Tạo hóa đơn thành công', 201);
  }

  async updateStatus(req, res) {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    response.success(res, order, 'Cập nhật trạng thái thành công');
  }

  async refund(req, res) {
    response.success(res, await orderService.refund(req.params.id), 'Hoàn tiền thành công');
  }
}

module.exports = new OrderController();
