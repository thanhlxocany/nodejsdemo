const dashboardService = require('../services/dashboard.service');
const response = require('../utils/response');

class DashboardController {
  async getSummary(req, res) {
    response.success(res, await dashboardService.getSummary());
  }
}

module.exports = new DashboardController();
