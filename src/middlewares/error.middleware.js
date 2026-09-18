function errorMiddleware(err, req, res, next) {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Co loi xay ra tren server'
  });
}

module.exports = errorMiddleware;
