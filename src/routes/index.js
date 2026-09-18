const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/categories', require('./category'));
router.use('/products', require('./product'));
router.use('/orders', require('./order'));
router.use('/customers', require('./customer'));
router.use('/suppliers', require('./supplier'));
router.use('/inventory', require('./inventory'));
router.use('/dashboard', require('./dashboard'));
router.use('/reports', require('./report'));
router.use('/settings', require('./settings'));

module.exports = router;
