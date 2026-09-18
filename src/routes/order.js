const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, orderController.getAll);
router.get('/:id', auth, orderController.getById);
router.post('/', auth, orderController.create);

module.exports = router;
