const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Danh sach don hang
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
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
router.get('/', auth, orderController.getAll);
/**
 * @openapi
 * /orders/summary:
 *   get:
 *     tags:
 *       - Order
 *     summary: Thong ke don hang theo trang thai
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, orderController.getSummary);
/**
 * @openapi
 * "/orders/{id}":
 *   get:
 *     tags:
 *       - Order
 *     summary: Chi tiet don hang
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
router.get('/:id', auth, orderController.getById);
/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - Order
 *     summary: Tao don hang (POS checkout), tra ve { orderId, code }
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CheckoutInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/', auth, orderController.create);
/**
 * @openapi
 * "/orders/{id}/status":
 *   patch:
 *     tags:
 *       - Order
 *     summary: Doi trang thai (huy se hoan lai ton kho)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/OrderStatusInput"
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.patch('/:id/status', auth, orderController.updateStatus);
/**
 * @openapi
 * "/orders/{id}/refund":
 *   post:
 *     tags:
 *       - Order
 *     summary: Hoan tien (chuyen thanh cancelled, hoan ton kho)
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
router.post('/:id/refund', auth, orderController.refund);

module.exports = router;
