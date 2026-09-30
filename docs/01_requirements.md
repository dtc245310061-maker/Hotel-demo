# Yêu cầu hệ thống Lumière Hotel AI

Bản demo đáp ứng các nhóm yêu cầu: quản lý tài khoản theo vai trò, quản lý phòng và trạng thái phòng, bảng giá dịch vụ, đặt phòng, lịch sử đặt phòng, dashboard vận hành, hỗ trợ quên mật khẩu và thiết lập tài khoản.

## Phạm vi demo

- `REQ-AUTH`: đăng nhập, đăng ký, quên mật khẩu, đăng xuất, cài đặt; phân biệt `admin` và `guest`.
- `REQ-ROOM`: hiển thị phòng, loại phòng, giá, tình trạng còn trống/đang ở/đang dọn/bảo trì.
- `REQ-BOOKING`: khách xem phòng trống và tạo đặt phòng; admin xem danh sách đặt phòng.
- `REQ-SERVICE`: hiển thị bảng giá dịch vụ; admin có điểm vào quản lý dịch vụ.
- `REQ-AI`: trợ lý Lumière AI hiển thị gợi ý trải nghiệm từ dữ liệu mẫu.
- `REQ-UX`: giao diện responsive, tiếng Việt, có hotline ở màn hình đăng nhập.

## Giới hạn

Dữ liệu demo dùng `localStorage`; chưa có xác thực server, email thật, thanh toán, cơ sở dữ liệu Django hay tích hợp AI API thật.

STATUS: PASS
NEXT_INPUT: docs/01_requirements.md
NEXT_PROMPT: prompts/02_design.md
TRACEABILITY_MATRIX_UPDATED: YES
