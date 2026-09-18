const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/categories', require('./category'));
router.use('/products', require('./product'));
router.use('/orders', require('./order'));

module.exports = router;
