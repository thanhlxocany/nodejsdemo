const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /customers:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Danh sach khach hang
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: tier
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/', auth, customerController.getAll);
/**
 * @openapi
 * /customers/summary:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Thong ke khach hang
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, customerController.getSummary);
/**
 * @openapi
 * "/customers/{id}":
 *   get:
 *     tags:
 *       - Customer
 *     summary: Chi tiet khach hang
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/:id', auth, customerController.getById);
/**
 * @openapi
 * /customers:
 *   post:
 *     tags:
 *       - Customer
 *     summary: Tao khach hang
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CustomerInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/', auth, customerController.create);

module.exports = router;
