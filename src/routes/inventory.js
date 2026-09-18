const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /inventory:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Ton kho
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: warehouse
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/', auth, inventoryController.getAll);
/**
 * @openapi
 * /inventory/summary:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: Thong ke ton kho
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, inventoryController.getSummary);
/**
 * @openapi
 * /inventory/movements:
 *   get:
 *     tags:
 *       - Inventory
 *     summary: 20 bien dong kho gan nhat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/movements', auth, inventoryController.getMovements);
/**
 * @openapi
 * /inventory/adjustments:
 *   post:
 *     tags:
 *       - Inventory
 *     summary: Nhap / xuat / dieu chinh ton kho
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdjustmentInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/adjustments', auth, inventoryController.createAdjustment);

module.exports = router;
