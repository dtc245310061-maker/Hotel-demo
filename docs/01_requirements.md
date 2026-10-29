# Yêu cầu hệ thống Lumière Hotel AI

Bản demo đáp ứng các nhóm yêu cầu: quản lý tài khoản theo vai trò, quản lý phòng và trạng thái phòng, bảng giá dịch vụ, đặt phòng, lịch sử đặt phòng, dashboard vận hành, hỗ trợ quên mật khẩu và thiết lập tài khoản.

## Phạm vi demo

- `REQ-AUTH`: đăng nhập, đăng ký, quên mật khẩu, đăng xuất, cài đặt; phân biệt `admin` và `guest`.
- `REQ-ROOM`: hiển thị phòng, loại phòng, giá, tình trạng còn trống/đang ở/đang dọn/bảo trì.
- `REQ-BOOKING`: khách xem phòng trống và tạo đặt phòng; admin xem danh sách đặt phòng.
- `REQ-SERVICE`: hiển thị bảng giá dịch vụ; admin có điểm vào quản lý dịch vụ.
- `REQ-AI`: trợ lý Lumière AI hỗ trợ hội thoại đa chủ đề, ngữ cảnh theo phiên và sử dụng LLM qua API; không khẳng định dữ liệu khách sạn trực tiếp khi backend chưa có database.
- `REQ-UX`: giao diện responsive, tiếng Việt, có hotline ở màn hình đăng nhập.

## Giới hạn

Dữ liệu nghiệp vụ demo dùng `localStorage`; chưa có xác thực server, email thật, thanh toán hoặc cơ sở dữ liệu Django. Chat có thể gọi API LLM khi được cấu hình khóa bí mật phía server; khóa này không được gửi tới frontend.

STATUS: PASS
NEXT_INPUT: docs/01_requirements.md
NEXT_PROMPT: prompts/02_design.md
TRACEABILITY_MATRIX_UPDATED: YES
