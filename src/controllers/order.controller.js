const orderService = require('../services/order.service');
const response = require('../utils/response');

class OrderController {
  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAll();
      response.success(res, orders);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      if (!order) {
        return response.error(res, 'Khong tim thay hoa don', 404);
      }
      response.success(res, order);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.createOrder({
        items: req.body.items,
        createdBy: req.user.id
      });
      response.success(res, order, 'Tao hoa don thanh cong', 201);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
