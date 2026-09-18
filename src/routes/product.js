const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Product
 *     summary: Danh sach san pham
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: categoryId
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
router.get('/', productController.getAll);
/**
 * @openapi
 * /products/summary:
 *   get:
 *     tags:
 *       - Product
 *     summary: Thong ke san pham
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/summary', auth, productController.getSummary);
/**
 * @openapi
 * "/products/{id}":
 *   get:
 *     tags:
 *       - Product
 *     summary: Chi tiet san pham
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
router.get('/:id', productController.getById);
/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Product
 *     summary: Tao san pham
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProductInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/', auth, productController.create);
/**
 * @openapi
 * "/products/{id}":
 *   patch:
 *     tags:
 *       - Product
 *     summary: Cap nhat san pham
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
 *             $ref: "#/components/schemas/ProductInput"
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.patch('/:id', auth, productController.update);
/**
 * @openapi
 * "/products/{id}":
 *   delete:
 *     tags:
 *       - Product
 *     summary: Xoa san pham
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
router.delete('/:id', auth, productController.remove);

module.exports = router;
