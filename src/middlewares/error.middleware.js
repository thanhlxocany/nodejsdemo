function getStatus(err) {
  if (err.status) return err.status;
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000) return 400;
  return 500;
}

function errorMiddleware(err, req, res, next) {
  const status = getStatus(err);
  if (status === 500) console.error(err);

  const message = err.code === 11000 ? 'Dữ liệu bị trùng (code/sku/email đã tồn tại)' : err.message;

  res.status(status).json({
    success: false,
    message: message || 'Có lỗi xảy ra trên server'
  });
}

module.exports = errorMiddleware;
