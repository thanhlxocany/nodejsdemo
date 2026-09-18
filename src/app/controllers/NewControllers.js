// Controller: chứa logic xử lý, route chỉ gọi vào đây
class NewControllers {
  // GET /
  index(req, res) {
    res.render('home', {
      title: 'Trang chủ',
      heading: 'Xin chào Handlebars',
      description: 'Đây là sample dùng Express và express-handlebars.',
      features: ['Layout dùng chung', 'Dữ liệu động', 'Render bằng Express']
    });
  }
}

module.exports = new NewControllers();
