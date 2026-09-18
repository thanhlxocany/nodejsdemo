const authService = require('../services/auth.service');
const response = require('../utils/response');

class AuthController {
  async register(req, res) {
    const user = await authService.register(req.body);
    response.success(res, user, 'Đăng ký thành công', 201);
  }

  async login(req, res) {
    const result = await authService.login(req.body);
    response.success(res, result, 'Đăng nhập thành công');
  }

  async me(req, res) {
    const user = await authService.getCurrentUser(req.user.id);
    response.success(res, user);
  }
}

module.exports = new AuthController();
