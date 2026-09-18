const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Dang ky
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/register', authController.register);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Dang nhap, tra ve { user, token }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginInput"
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/login', authController.login);
/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: User dang dang nhap
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/me', auth, authController.me);

module.exports = router;
