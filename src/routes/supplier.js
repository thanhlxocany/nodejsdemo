const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /suppliers:
 *   get:
 *     tags:
 *       - Supplier
 *     summary: Danh sach nha cung cap
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
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/', auth, supplierController.getAll);
/**
 * @openapi
 * /suppliers/summary:
 *   get:
 *     tags:
 *       - Supplier
 *     summary: Thong ke nha cung cap
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, supplierController.getSummary);
/**
 * @openapi
 * "/suppliers/{id}":
 *   get:
 *     tags:
 *       - Supplier
 *     summary: Chi tiet nha cung cap
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
router.get('/:id', auth, supplierController.getById);
/**
 * @openapi
 * /suppliers:
 *   post:
 *     tags:
 *       - Supplier
 *     summary: Tao nha cung cap
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SupplierInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/', auth, supplierController.create);

module.exports = router;
