# Review và kiểm thử demo

## Coverage

| Requirement ID | Implementation Evidence | Test Type | Result |
|---|---|---|---|
| REQ-AUTH | `dist/index.html`, form đăng nhập/đăng ký | kiểm tra trình duyệt | Chưa chạy trong lượt cập nhật này |
| REQ-ROOM | `dist/index.html`, lọc và trạng thái phòng | thao tác HTTP/UI | Chưa chạy trong lượt cập nhật này |
| REQ-BOOKING | `dist/index.html`, modal và lịch đặt | tạo booking qua trình duyệt | Chưa chạy trong lượt cập nhật này |
| REQ-SERVICE | `dist/index.html`, bảng dịch vụ | kiểm tra giao diện | Chưa chạy trong lượt cập nhật này |
| REQ-AI | `dist/index.html`, `django_server/ai_service.py` | kiểm thử Ollama mặc định, model chưa tải, API hosted tùy chọn, lịch sử/lỗi/giới hạn/dữ liệu nhạy cảm | 19 tests; xem ghi chú bên dưới |
| REQ-UX | `dist/index.html` | kiểm tra cú pháp JavaScript | PASS; chưa kiểm tra trực quan trên trình duyệt |

## Giới hạn còn lại

Đây là demo dùng `localStorage`; chưa có xác thực server-side, database, upload, email reset mật khẩu hoặc thanh toán. Chế độ Ollama không yêu cầu API key, nhưng cần cài Ollama và tải mô hình. Chế độ OpenAI hosted tùy chọn cần API key và có thể phát sinh phí. Test dùng mock, không xác minh phản hồi từ mô hình thật.

## Kiểm tra đã chạy trong lượt cập nhật

- `py manage.py test django_server --noinput`: 19 tests passed; kiểm thử Ollama/OpenAI SDK dùng mock, không gọi API mô hình thật.
- `py manage.py check`: không có lỗi cấu hình Django.
- Kiểm tra cú pháp JavaScript inline bằng Node.js: thành công.
- `git diff --check`: không phát hiện whitespace errors.
- Kiểm tra máy: 16 GB RAM, NVIDIA RTX 3050 Ti Laptop GPU 4 GB; Ollama chưa cài/chưa chạy nên chưa chạy kiểm thử suy luận thực tế.
- Chạy `start-demo.bat` chưa kiểm tra đến khi Ollama được cài; không báo AI sẵn sàng nếu chưa xác minh mô hình.
