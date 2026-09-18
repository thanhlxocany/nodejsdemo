function success(res, data = null, message = 'Thành công', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function error(res, message = 'Có lỗi xảy ra', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = {
  success,
  error
};
