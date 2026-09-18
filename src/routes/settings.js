const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @openapi
 * /settings/store:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Thong tin cua hang
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/store', auth, settingsController.getStore);
/**
 * @openapi
 * /settings/store:
 *   put:
 *     tags:
 *       - Settings
 *     summary: Cap nhat thong tin cua hang
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StoreInput"
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.put('/store', auth, settingsController.updateStore);
/**
 * @openapi
 * /settings/staff:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Danh sach nhan vien
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.get('/staff', auth, settingsController.getStaff);
/**
 * @openapi
 * /settings/staff:
 *   post:
 *     tags:
 *       - Settings
 *     summary: Them nhan vien (mat khau mac dinh lay tu DEFAULT_STAFF_PASSWORD)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StaffInput"
 *     responses:
 *       "201":
 *         description: Thanh cong
 *       "400":
 *         description: Loi du lieu
 */
router.post('/staff', auth, settingsController.createStaff);

module.exports = router;
