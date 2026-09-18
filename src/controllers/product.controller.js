const productService = require('../services/product.service');
const response = require('../utils/response');

class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAll();
      response.success(res, products);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) {
        return response.error(res, 'Khong tim thay san pham', 404);
      }
      response.success(res, product);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      response.success(res, product, 'Tao san pham thanh cong', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      if (!product) {
        return response.error(res, 'Khong tim thay san pham', 404);
      }
      response.success(res, product, 'Cap nhat thanh cong');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const product = await productService.remove(req.params.id);
      if (!product) {
        return response.error(res, 'Khong tim thay san pham', 404);
      }
      response.success(res, null, 'Xoa thanh cong');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
