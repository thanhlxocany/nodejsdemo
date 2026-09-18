const categoryService = require('../services/category.service');
const response = require('../utils/response');

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAll();
      response.success(res, categories);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await categoryService.getById(req.params.id);
      if (!category) {
        return response.error(res, 'Khong tim thay danh muc', 404);
      }
      response.success(res, category);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await categoryService.create(req.body);
      response.success(res, category, 'Tao danh muc thanh cong', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      if (!category) {
        return response.error(res, 'Khong tim thay danh muc', 404);
      }
      response.success(res, category, 'Cap nhat thanh cong');
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const category = await categoryService.remove(req.params.id);
      if (!category) {
        return response.error(res, 'Khong tim thay danh muc', 404);
      }
      response.success(res, null, 'Xoa thanh cong');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
