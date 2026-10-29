# Review và kiểm thử demo

## Coverage

| Requirement ID | Implementation Evidence | Test Type | Result |
|---|---|---|---|
| REQ-AUTH | `dist/index.html`, form đăng nhập/đăng ký | kiểm tra trình duyệt | Chưa chạy trong lượt cập nhật này |
| REQ-ROOM | `dist/index.html`, lọc và trạng thái phòng | thao tác HTTP/UI | Chưa chạy trong lượt cập nhật này |
| REQ-BOOKING | `dist/index.html`, modal và lịch đặt | tạo booking qua trình duyệt | Chưa chạy trong lượt cập nhật này |
| REQ-SERVICE | `dist/index.html`, bảng dịch vụ | kiểm tra giao diện | Chưa chạy trong lượt cập nhật này |
| REQ-AI | `dist/index.html`, `django_server/ai_service.py` | 14 kiểm thử Django tự động, cấu hình/lịch sử/lỗi/giới hạn/dữ liệu nhạy cảm | PASS |
| REQ-UX | `dist/index.html` | kiểm tra cú pháp JavaScript | PASS; chưa kiểm tra trực quan trên trình duyệt |

## Giới hạn còn lại

Đây là demo dùng `localStorage`; chưa có xác thực server-side, database, upload, email reset mật khẩu hoặc thanh toán. Chat gọi mô hình AI thật chỉ khi được cấu hình API key hợp lệ. Không có kiểm thử gọi nhà cung cấp thật; kiểm thử tích hợp dùng phản hồi giả từ mock và không xác nhận API key hoặc tài khoản nhà cung cấp.

## Kiểm tra đã chạy trong lượt cập nhật

- `py manage.py test django_server --noinput`: 14 tests passed; kiểm thử OpenAI SDK và lỗi nhà cung cấp dùng mock, không gọi API thật.
- `py manage.py check`: không có lỗi cấu hình Django.
- Kiểm tra cú pháp JavaScript inline bằng Node.js: thành công.
- `git diff --check`: không phát hiện whitespace errors.
