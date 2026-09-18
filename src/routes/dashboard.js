const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Tong quan hom nay
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, dashboardController.getSummary);

module.exports = router;
