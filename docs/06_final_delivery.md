# Bàn giao Lumière Hotel AI

## Trạng thái

Demo chạy local bằng Django. Chat gọi mô hình AI qua OpenAI SDK khi có API key hợp lệ. Django nạp `.env` từ thư mục gốc khi khởi động; không xác nhận kết nối hoặc chất lượng phản hồi với nhà cung cấp thật trong lượt cập nhật này.

Không dùng production: dữ liệu nghiệp vụ vẫn ở `localStorage`, chưa có database hoặc xác thực server-side. Do đó AI không nhận dữ liệu phòng/đặt phòng trực tiếp và không được dùng để thay đổi dữ liệu.

## Kiểm tra đã thực hiện

- `py manage.py test django_server --noinput`: 14 kiểm thử đạt; lời gọi nhà cung cấp được mock.
- `py manage.py check`: không có lỗi cấu hình Django.
- Kiểm tra cú pháp JavaScript inline bằng Node.js: thành công.
- `git diff --check`: không phát hiện lỗi whitespace.

Chưa chạy kiểm thử đăng nhập/đặt phòng trên trình duyệt và chưa gọi API AI thật. Chi tiết ở [docs/05_review_testing.md](./05_review_testing.md).
