# XeDap.vn - API Thanh toán

## Cài đặt và Chạy

1. Cài đặt dependencies:
   ```
   npm install
   ```

2. Thay Stripe keys trong `server.js` và `thanhtoan.html`:
   - Đăng ký tài khoản Stripe (https://stripe.com)
   - Lấy publishable key (pk_test_...) và secret key (sk_test_...)
   - Thay trong `thanhtoan.html`: `const stripe = Stripe('pk_test_...');`
   - Thay trong `server.js`: `const stripe = require('stripe')('sk_test_...');`

3. Chạy server:
   ```
   node server.js
   ```

4. Mở `thanhtoan.html` trong browser (có thể dùng live server để tránh CORS).

## Cách hoạt động

- Khi người dùng nhấn "Đặt hàng", frontend gửi request đến server để tạo Stripe Checkout Session.
- Server tạo session với sản phẩm và redirect đến Stripe.
- Sau thanh toán, Stripe redirect về success.html hoặc cancel.html.

## Lưu ý

- Đây là demo, cần cấu hình webhook để xử lý thanh toán thành công.
- Cho production, cần HTTPS và xử lý lỗi tốt hơn.