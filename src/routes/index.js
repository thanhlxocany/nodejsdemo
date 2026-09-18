const express = require('express');
const router = express.Router();

// Gom tất cả route con vào đây, index.js chỉ cần require thư mục routes
router.use('/', require('./new'));
router.use('/about', require('./about'));

module.exports = router;
