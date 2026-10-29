# Báo cáo triển khai

Đã triển khai demo Python/Django theo các task `TASK-01` đến `TASK-05`. Django phục vụ trang tự chứa `dist/index.html`; giao diện, kiểu dáng và logic trình duyệt được đặt trong tệp này. Bao gồm tài khoản theo vai trò, dashboard, phòng, đặt phòng, dịch vụ, vận hành, báo cáo, hồ sơ và trợ lý AI hội thoại.

## Chat AI

Chat gửi lịch sử hội thoại qua `POST /api/chat/` đến `django_server/ai_service.py`. Mặc định, OpenAI SDK được trỏ vào endpoint tương thích OpenAI của Ollama trên localhost; mô hình mặc định `qwen2.5:3b` chạy cục bộ, không cần API key hosted. Ollama và mô hình được xác minh trước mỗi yêu cầu. Có thể tùy chọn `AI_PROVIDER=openai` cùng `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL` để dùng dịch vụ hosted. Django tự nạp `.env` ở thư mục gốc qua `python-dotenv`; biến môi trường hệ thống được ưu tiên. API giới hạn kích thước yêu cầu/lịch sử, số lần gọi, thời gian chờ và token đầu ra; một số thông tin liên hệ hoặc nhạy cảm được ẩn trước khi gửi. Khi thiếu Ollama/mô hình, key hosted sai, hết hạn mức, timeout hoặc mất kết nối, giao diện hiển thị lỗi phù hợp và cho phép thử lại; không có câu trả lời giả lập.

Dữ liệu phòng, giá và đặt phòng của demo hiện chỉ nằm trong `localStorage`; dự án chưa có database hay xác thực server-side. Vì vậy, API không gửi dữ liệu trình duyệt không đáng tin cậy cho mô hình và hướng dẫn AI không xác nhận thông tin khách sạn trực tiếp hoặc thực hiện thao tác nghiệp vụ.

## Khởi chạy trên Windows

`start-demo.bat` kiểm tra Python, thư viện, Ollama và mô hình. Khi thiếu mô hình, script tải về và chỉ khởi chạy website sau khi tải thành công. Cấu hình Ollama mặc định nằm trong `.env.example`.

## Verification

- `py manage.py test django_server --noinput`: kiểm thử unit/API với Ollama mock.
- `py manage.py check`: kiểm tra cấu hình Django.
- Kiểm tra JavaScript inline bằng Node.js.
- Chưa xác minh suy luận trên Ollama thật nếu Ollama chưa được cài trên máy.
