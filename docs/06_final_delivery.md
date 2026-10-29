# Bàn giao Lumière Hotel AI

## Trạng thái

Demo chạy local bằng Django. Chat mặc định gọi OpenAI API; cần API key do người dùng cấu hình trong `.env`. BAT kiểm tra Python/dependencies/cấu hình và chạy website, không cài Ollama hoặc tải mô hình.

Không dùng production: dữ liệu nghiệp vụ vẫn ở `localStorage`, chưa có database hoặc xác thực server-side. Do đó AI không nhận dữ liệu phòng/đặt phòng trực tiếp và không được dùng để thay đổi dữ liệu.

## Kiểm tra đã thực hiện

- `py manage.py test django_server --noinput`: PASS, 26/26 test; test AI dùng mock và không gọi API thật.
- `py manage.py check`: không có lỗi cấu hình Django.
- Kiểm tra cú pháp JavaScript inline bằng Node.js: thành công.
- `git diff --check`: không phát hiện lỗi whitespace.

Chưa gọi OpenAI API thật vì môi trường hiện tại không có API key; chưa chạy hồi quy đăng nhập/đặt phòng trên trình duyệt. Chi tiết ở [docs/05_review_testing.md](./05_review_testing.md).
