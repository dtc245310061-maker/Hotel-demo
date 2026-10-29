# Bàn giao Lumière Hotel AI

## Trạng thái

Demo chạy local bằng Django. Chat mặc định dùng Ollama và mô hình `qwen2.5:3b` trên máy, không yêu cầu OpenAI API key. `start-demo.bat` kiểm tra Ollama, tải mô hình nếu thiếu và chỉ mở website sau khi tải hoàn tất. Chế độ OpenAI hosted vẫn là tùy chọn riêng. Chưa xác nhận suy luận Ollama thật vì máy kiểm thử chưa cài Ollama.

Không dùng production: dữ liệu nghiệp vụ vẫn ở `localStorage`, chưa có database hoặc xác thực server-side. Do đó AI không nhận dữ liệu phòng/đặt phòng trực tiếp và không được dùng để thay đổi dữ liệu.

## Kiểm tra đã thực hiện

- `py manage.py test django_server --noinput`: 19 kiểm thử đạt; Ollama và OpenAI SDK được mock.
- `py manage.py check`: không có lỗi cấu hình Django.
- Kiểm tra cú pháp JavaScript inline bằng Node.js: thành công.
- `git diff --check`: không phát hiện lỗi whitespace.

Chưa cài Ollama, tải mô hình hoặc chạy kiểm thử hội thoại thực tế trên mô hình; chưa chạy hồi quy đăng nhập/đặt phòng trên trình duyệt. Chi tiết ở [docs/05_review_testing.md](./05_review_testing.md).
