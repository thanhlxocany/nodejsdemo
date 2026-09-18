const reportService = require('../services/report.service');
const response = require('../utils/response');

class ReportController {
  async getSummary(req, res) {
    response.success(res, await reportService.getSummary(req.query));
  }
}

module.exports = new ReportController();
