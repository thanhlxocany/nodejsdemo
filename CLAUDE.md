# nodejsdemo

Backend REST API cho hệ thống quản lý cửa hàng tạp hoá, dùng Express + Mongoose (MongoDB). Không có view/HTML — chỉ trả JSON, FE là project riêng biệt gọi API.
Người viết code đang học Node.js — ưu tiên code đơn giản, dễ hiểu, không over-engineering.

Chi tiết nghiệp vụ/endpoint xem ở [REQUIREMENTS.md](REQUIREMENTS.md).

## Cấu trúc thư mục

```
src/
  app.js              # Khởi tạo Express app, gắn middleware, mount routes tại /api
  index.js            # Entry point: connect DB + app.listen
  config/             # Cấu hình (env.js, database.js)
  controllers/        # Xử lý request/response, gọi service, KHÔNG chứa business logic phức tạp
  services/           # Business logic, thao tác với model/DB
  models/             # Mongoose schema/model
  routes/             # Định nghĩa route, map route -> controller
  middlewares/        # Middleware dùng chung (auth, error, notFound, ...)
  utils/              # Hàm tiện ích dùng lại nhiều nơi (response.js chuẩn hoá format JSON trả về)
```

## Luồng xử lý 1 request

`routes/*.js` -> `controllers/*.js` -> `services/*.js` -> `models/*.js` (nếu cần DB)

- Route: chỉ khai báo path + method + controller method tương ứng.
- Controller: nhận `req, res`, validate cơ bản, gọi service, trả response JSON qua `utils/response.js`. Không viết logic nghiệp vụ hay query DB trực tiếp trong controller.
- Service: chứa business logic, gọi Model để thao tác DB.
- Model: định nghĩa Mongoose schema, export bằng `mongoose.model(...)`.

## Naming convention

- File: `camelCase` cho file thường, không dùng PascalCase cho tên file (VD `about.controller.js`, không phải `AboutControllers.js`).
- Model: đặt tên file dạng `xxx.model.js`, export bằng singular PascalCase (`User`, `Post`).
- Route: đặt tên file dạng `xxx.js` theo resource (`product.js`, `order.js`), gom lại ở `routes/index.js`.
- Service: đặt tên file dạng `xxx.service.js`, export instance hoặc object chứa các hàm.
- Middleware: đặt tên file dạng `xxx.middleware.js`.
- Biến, hàm: `camelCase`. Hằng số cấu hình: `UPPER_SNAKE_CASE`.

## Coding convention

- Dùng `async/await`, không dùng `.then/.catch` lồng nhau.
- Luôn bọc code có thao tác DB/async trong `try/catch`, lỗi thì `next(error)` để middleware `error.middleware.js` xử lý tập trung — không tự viết `res.status(500)` rải rác trong controller.
- Không hard-code giá trị cấu hình (port, URI DB, secret...) — luôn đọc qua `config/env.js` (biến môi trường từ `.env`).
- Không viết comment giải thích code làm gì (code phải tự đọc hiểu qua tên biến/hàm), chỉ comment khi có lý do đặc biệt (workaround, giới hạn kỹ thuật...).
- Không thêm thư viện/pattern mới khi task hiện tại chưa cần đến.
- Mỗi file chỉ nên đảm nhiệm một trách nhiệm (single responsibility) — không nhét route + logic + query vào chung 1 file.

## Mongoose

- Mỗi model 1 file trong `src/models/`.
- Bật `{ timestamps: true }` cho các schema cần theo dõi thời gian tạo/sửa.
- Validate dữ liệu (`required`, `unique`, `enum`...) khai báo ngay trong schema, không validate thủ công lại ở controller trừ khi cần logic đặc thù.

## Ngôn ngữ giao tiếp

- Giải thích, trả lời luôn bằng tiếng Việt, dễ hiểu cho người mới học Node.js.
