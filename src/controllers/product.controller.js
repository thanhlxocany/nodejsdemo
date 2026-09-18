const productService = require('../services/product.service');
const response = require('../utils/response');

class ProductController {
  async getAll(req, res) {
    response.success(res, await productService.getAll(req.query));
  }

  async getSummary(req, res) {
    response.success(res, await productService.getSummary());
  }

  async getById(req, res) {
    response.success(res, await productService.getById(req.params.id));
  }

  async create(req, res) {
    const product = await productService.create(req.body);
    response.success(res, product, 'Tạo sản phẩm thành công', 201);
  }

  async update(req, res) {
    const product = await productService.update(req.params.id, req.body);
    response.success(res, product, 'Cập nhật thành công');
  }

  async remove(req, res) {
    await productService.remove(req.params.id);
    response.success(res, null, 'Xóa thành công');
  }
}

module.exports = new ProductController();
