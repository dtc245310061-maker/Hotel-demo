# Báo cáo triển khai

Đã triển khai demo Python/Django theo các task `TASK-01` đến `TASK-05`. Django phục vụ trang tự chứa `dist/index.html`; giao diện, kiểu dáng và logic trình duyệt được đặt trong tệp này. Bao gồm tài khoản theo vai trò, dashboard, phòng, đặt phòng, dịch vụ, vận hành, báo cáo, hồ sơ và trợ lý AI hội thoại.

## Chat AI

Chat gửi lịch sử hội thoại qua `POST /api/chat/` đến lớp dịch vụ `django_server/ai_service.py`, gọi OpenAI SDK bằng cấu hình server-side (`OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`). Django tự nạp `.env` ở thư mục gốc qua `python-dotenv` khi khởi động; biến môi trường hệ thống được ưu tiên. API giới hạn kích thước yêu cầu/lịch sử, số lần gọi, thời gian chờ và token đầu ra; một số thông tin liên hệ hoặc nhạy cảm được ẩn trước khi gửi. Khi thiếu/sai key, hết hạn mức, timeout hoặc mất kết nối, giao diện hiển thị lỗi phù hợp và cho phép thử lại; không có câu trả lời giả lập.

Dữ liệu phòng, giá và đặt phòng của demo hiện chỉ nằm trong `localStorage`; dự án chưa có database hay xác thực server-side. Vì vậy, API không gửi dữ liệu trình duyệt không đáng tin cậy cho mô hình và hướng dẫn AI không xác nhận thông tin khách sạn trực tiếp hoặc thực hiện thao tác nghiệp vụ.

## Verification

- `py manage.py check`: kiểm tra cấu hình Django.
- `py manage.py runserver 127.0.0.1:8000`: chạy HTTP local.
- Kiểm tra trình duyệt: đăng nhập quản trị/khách, điều hướng phòng, hỏi chatbot, tạo đặt phòng.

## Skills.sh Evidence

Áp dụng `frontend-design` cho giao diện; `tdd`/verification-first cho build và smoke flow.

STATUS: PASS
NEXT_INPUT: source code, tests, docs/04_implementation.md
NEXT_PROMPT: prompts/05_review_testing.md
TRACEABILITY_MATRIX_UPDATED: YES
BACKTRACK_REQUIRED: NONE
