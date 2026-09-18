const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Danh sach danh muc
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/', categoryController.getAll);
/**
 * @openapi
 * "/categories/{id}":
 *   get:
 *     tags:
 *       - Category
 *     summary: Chi tiet danh muc
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
router.get('/:id', categoryController.getById);
/**
 * @openapi
 * /categories:
 *   post:
 *     tags:
 *       - Category
 *     summary: Tao danh muc
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CategoryInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/', auth, categoryController.create);
/**
 * @openapi
 * "/categories/{id}":
 *   patch:
 *     tags:
 *       - Category
 *     summary: Cap nhat danh muc
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
 *             $ref: "#/components/schemas/CategoryInput"
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.patch('/:id', auth, categoryController.update);
/**
 * @openapi
 * "/categories/{id}":
 *   delete:
 *     tags:
 *       - Category
 *     summary: Xoa danh muc (khong xoa duoc neu con san pham)
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
router.delete('/:id', auth, categoryController.remove);

module.exports = router;
