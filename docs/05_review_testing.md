# Review và kiểm thử demo

## Coverage

| Requirement ID | Implementation Evidence | Test Type | Result |
|---|---|---|---|
| REQ-AUTH | `dist/index.html`, form đăng nhập/đăng ký | kiểm tra trình duyệt | Chưa chạy trong lượt cập nhật này |
| REQ-ROOM | `dist/index.html`, lọc và trạng thái phòng | thao tác HTTP/UI | Chưa chạy trong lượt cập nhật này |
| REQ-BOOKING | `dist/index.html`, modal và lịch đặt | tạo booking qua trình duyệt | Chưa chạy trong lượt cập nhật này |
| REQ-SERVICE | `dist/index.html`, bảng dịch vụ | kiểm tra giao diện | Chưa chạy trong lượt cập nhật này |
| REQ-AI | `dist/index.html`, `django_server/ai_service.py`, `django_server/documents.py` | kiểm thử Gemini mặc định, lịch sử/lỗi/giới hạn, trích xuất và tìm kiếm tài liệu | PASS: 29/29 test Django (Gemini SDK được mock) |
| REQ-UX | `dist/index.html` | kiểm tra cú pháp JavaScript | PASS; chưa kiểm tra trực quan trên trình duyệt |

## Giới hạn còn lại

Đây là demo dùng `localStorage`; chưa có xác thực server-side, database, giao diện upload, email reset mật khẩu hoặc thanh toán. Chat dùng Gemini API; `gemini-2.5-flash` hiện có Free Tier nhưng quota phụ thuộc tài khoản và có thể thay đổi. Test dùng mock, không xác minh phản hồi từ mô hình thật.

## Kiểm tra đã chạy trong lượt cập nhật

- `py manage.py test django_server --noinput`: PASS, 29/29 test; kiểm thử SDK dùng mock, không gọi API mô hình thật.
- `py manage.py check`: không có lỗi cấu hình Django.
- Kiểm tra cú pháp JavaScript inline bằng Node.js: thành công.
- `git diff --check`: không phát hiện whitespace errors.
- Không có kiểm thử gọi Gemini API thật nếu chưa được cấu hình `GEMINI_API_KEY`.
- Kiểm tra đăng nhập/đặt phòng trực quan trên trình duyệt chưa được chạy trong lượt này; dữ liệu tiếp tục được lưu ở `localStorage`.
