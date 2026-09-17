// Import thư viện Express để tạo web server
const express = require('express');
// Import morgan để ghi log request (dùng để debug, xem ai gọi API gì)
var morgan = require('morgan')
// Import engine từ express-handlebars để render file .hbs thành HTML
var { engine } = require('express-handlebars')
// Module path có sẵn của Node, dùng để ghép đường dẫn file/thư mục
const path = require('path');


// Khởi tạo ứng dụng Express
const app = express();
// Middleware: log ra console mọi request gửi tới server (method, url, status,...)
app.use(morgan('combined'))
// Middleware: parse dữ liệu form HTML (Content-Type: x-www-form-urlencoded) vào req.body
app.use(express.urlencoded({ extended: true }));
// Middleware: cho phép truy cập trực tiếp file tĩnh (css, js, ảnh) trong thư mục src/public
app.use(express.static(path.join(__dirname, 'public')));
// Đăng ký engine render file .hbs, chỉ định layout mặc định và thư mục chứa layout
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'resources/views/layouts')
}));
// Khai báo thư mục chứa các file view (.hbs)
app.set('views', path.join(__dirname, 'resources/views'));
// Khai báo view engine đang dùng là hbs (Handlebars)
app.set('view engine', 'hbs');

// Route xử lý khi có request GET tới trang chủ "/"
app.get('/', (req, res) => {
    // Render view "home" và truyền dữ liệu động vào template
    res.render('home', {
      title: 'Trang chủ',
      heading: 'Xin chào Handlebars',
      description: 'Đây là sample dùng Express và express-handlebars.',
      features: ['Layout dùng chung', 'Dữ liệu động', 'Render bằng Express']
    });
});

// Khởi động server, lắng nghe request tại cổng 3000
app.listen(3000, () => {
  console.log('Server chạy tại port 3000');

});
