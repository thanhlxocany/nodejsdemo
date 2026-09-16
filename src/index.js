const express = require('express');
var morgan = require('morgan')
var { engine } = require('express-handlebars')
const path = require('path');


const app = express();
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'resources/public')));
app.engine('handlebars', engine({extname: '.hbs'}));
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home', {
      title: 'Trang chủ',
      heading: 'Xin chào Handlebars',
      description: 'Đây là sample dùng Express và express-handlebars.',
      features: ['Layout dùng chung', 'Dữ liệu động', 'Render bằng Express']
    });
});

app.listen(3000, () => {
  console.log('Server chạy tại port 3000');

});