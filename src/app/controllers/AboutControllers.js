class AboutControllers {
  // GET /about
  index(req, res) {
    res.render('about', {
      title: 'Giới thiệu',
      heading: 'Về trang này'
    });
  }
}

module.exports = new AboutControllers();
