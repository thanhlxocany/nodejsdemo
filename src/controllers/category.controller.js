const categoryService = require('../services/category.service');
const response = require('../utils/response');

class CategoryController {
  async getAll(req, res) {
    response.success(res, await categoryService.getAll());
  }

  async getById(req, res) {
    response.success(res, await categoryService.getById(req.params.id));
  }

  async create(req, res) {
    const category = await categoryService.create(req.body);
    response.success(res, category, 'Tạo danh mục thành công', 201);
  }

  async update(req, res) {
    const category = await categoryService.update(req.params.id, req.body);
    response.success(res, category, 'Cập nhật thành công');
  }

  async remove(req, res) {
    await categoryService.remove(req.params.id);
    response.success(res, null, 'Xóa thành công');
  }
}

module.exports = new CategoryController();
