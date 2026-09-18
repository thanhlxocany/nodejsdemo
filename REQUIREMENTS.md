# Yêu cầu dự án: Quản lý cửa hàng tạp hoá

Backend REST API bằng Node.js + Express + MongoDB (Mongoose). Không có giao diện web quản lý (client sẽ gọi API riêng, ví dụ React/Vue sau này).

## 1. Đăng nhập quản trị (Auth)

- `POST /api/auth/register` — Tạo tài khoản (name, email, password). Mật khẩu được hash bằng bcrypt trước khi lưu.
- `POST /api/auth/login` — Đăng nhập bằng email/password, trả về JWT token.
- Token gửi kèm request qua header `Authorization: Bearer <token>`.
- Các route ghi dữ liệu (tạo/sửa/xoá sản phẩm, danh mục, tạo hoá đơn, xem danh sách hoá đơn) đều yêu cầu đã đăng nhập.
- Route xem danh sách/chi tiết sản phẩm, danh mục thì public, không cần đăng nhập.

## 2. Quản lý danh mục (Category)

- `GET /api/categories` — Danh sách danh mục (public).
- `GET /api/categories/:id` — Chi tiết 1 danh mục (public).
- `POST /api/categories` — Tạo danh mục mới (cần đăng nhập). Body: `{ name, description }`.
- `PUT /api/categories/:id` — Sửa danh mục (cần đăng nhập).
- `DELETE /api/categories/:id` — Xoá danh mục (cần đăng nhập).

## 3. Quản lý sản phẩm (Product)

- `GET /api/products` — Danh sách sản phẩm, kèm thông tin danh mục (populate) (public).
- `GET /api/products/:id` — Chi tiết 1 sản phẩm (public).
- `POST /api/products` — Tạo sản phẩm mới (cần đăng nhập). Body: `{ name, price, stock, unit, category }`.
- `PUT /api/products/:id` — Sửa sản phẩm (cần đăng nhập).
- `DELETE /api/products/:id` — Xoá sản phẩm (cần đăng nhập).

Mỗi sản phẩm thuộc về 1 danh mục (`category` là ObjectId tham chiếu tới Category).

## 4. Bán hàng / hoá đơn (Order)

- `POST /api/orders` — Tạo hoá đơn bán hàng (cần đăng nhập).
  - Body: `{ items: [{ product: "<id>", quantity: number }] }`.
  - Hệ thống tự lấy giá hiện tại của sản phẩm, kiểm tra đủ tồn kho, trừ tồn kho, tính tổng tiền `totalAmount`.
  - Nếu sản phẩm không tồn tại hoặc không đủ tồn kho → trả lỗi, không tạo hoá đơn.
- `GET /api/orders` — Danh sách hoá đơn (cần đăng nhập).
- `GET /api/orders/:id` — Chi tiết 1 hoá đơn (cần đăng nhập).

**Lưu ý kỹ thuật**: việc trừ tồn kho hiện làm tuần tự bằng Mongoose thông thường (không dùng MongoDB transaction), vì transaction chỉ chạy được khi MongoDB cấu hình replica set. Nếu sau này deploy với replica set / MongoDB Atlas, có thể nâng cấp `order.service.js` để dùng transaction cho an toàn tuyệt đối khi nhiều người bán hàng cùng lúc.

## 5. Cấu trúc dữ liệu (Model)

**User**: `name, email, password (hashed), role (admin|staff)`

**Category**: `name (unique), description`

**Product**: `name, price, stock, unit, category (ref Category)`

**Order**: `items: [{ product (ref Product), quantity, price }], totalAmount, createdBy (ref User)`

## 6. Chuẩn response API

Theo `src/utils/response.js` đã có sẵn:

```json
// Thành công
{ "success": true, "message": "...", "data": {...} }

// Lỗi
{ "success": false, "message": "..." }
```

## 7. Việc chưa làm / có thể mở rộng sau

- Phân trang, tìm kiếm, lọc sản phẩm theo danh mục/tên.
- Thống kê doanh thu theo ngày/tháng.
- Quản lý khách hàng (Customer), công nợ.
- Nhập hàng / phiếu nhập kho (tăng tồn kho) — hiện tại tồn kho chỉ set thủ công qua `PUT /api/products/:id`.
- Phân quyền chi tiết theo `role` (admin vs staff) — hiện tại mọi user đăng nhập đều có quyền như nhau.
- Test tự động (unit test / integration test).

Xem thêm quy tắc coding convention chung ở [CLAUDE.md](CLAUDE.md).
