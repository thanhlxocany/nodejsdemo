function notFoundMiddleware(req, res) {
  res.status(404).json({ success: false, message: `Khong tim thay route ${req.originalUrl}` });
}

module.exports = notFoundMiddleware;
