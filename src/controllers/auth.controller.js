const authService = require('../services/auth.service');
const response = require('../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      response.success(res, user, 'Dang ky thanh cong', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      response.success(res, result, 'Dang nhap thanh cong');
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      response.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
