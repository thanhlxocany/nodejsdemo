const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /reports/summary:
 *   get:
 *     tags:
 *       - Report
 *     summary: Bao cao (mac dinh 7 ngay gan nhat)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: from
 *         in: query
 *         schema:
 *           type: string
 *       - name: to
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, reportController.getSummary);

module.exports = router;
