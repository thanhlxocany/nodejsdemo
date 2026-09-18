// Đọc file .env, nạp vào process.env
require('dotenv').config();
// Import thư viện Express để tạo web server
const express = require('express');
// Import morgan để ghi log request (dùng để debug, xem ai gọi API gì)
var morgan = require('morgan')
// Import engine từ express-handlebars để render file .hbs thành HTML
var { engine } = require('express-handlebars')
// Module path có sẵn của Node, dùng để ghép đường dẫn file/thư mục
const path = require('path');
// Router chứa các route, logic xử lý nằm trong Controller (src/app/controllers)
const routes = require('./routes');

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

// Gắn toàn bộ route (src/routes/index.js) vào app
app.use('/', routes);

// Khởi động server, lắng nghe request tại cổng lấy từ .env (mặc định 3000 nếu không có)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại port ${PORT}`);
});
