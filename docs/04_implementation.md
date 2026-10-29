# Báo cáo triển khai

Đã triển khai demo Python/Django theo các task `TASK-01` đến `TASK-05`. Django phục vụ trang tự chứa `dist/index.html`; giao diện, kiểu dáng và logic trình duyệt được đặt trong tệp này. Bao gồm tài khoản theo vai trò, dashboard, phòng, đặt phòng, dịch vụ, vận hành, báo cáo, hồ sơ và trợ lý AI hội thoại.

## Chat AI

Chat gửi lịch sử hội thoại qua `POST /api/chat/` đến `django_server/ai_service.py`, dùng OpenAI SDK và `AI_PROVIDER=openai` mặc định. `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL` chỉ được đọc ở backend từ `.env` hoặc biến môi trường. Có thể chọn `AI_PROVIDER=openai-compatible` cho endpoint HTTPS tương thích. Django tự nạp `.env` ở thư mục gốc qua `python-dotenv`; biến môi trường hệ thống được ưu tiên. API giới hạn kích thước yêu cầu/lịch sử, số lần gọi, thời gian chờ và token đầu ra; một số thông tin liên hệ hoặc nhạy cảm được ẩn trước khi gửi. Khi thiếu/sai key, hết hạn mức, timeout hoặc mất kết nối, giao diện hiển thị lỗi phù hợp và cho phép thử lại; không có câu trả lời giả lập.

Tài liệu được quản trị viên đặt thủ công trong `knowledge_base/`. `django_server/documents.py` trích xuất PDF, DOCX, TXT và Markdown, chia đoạn và xếp hạng theo độ liên quan; các đoạn phù hợp được gửi kèm câu hỏi và lịch sử cho LLM. Không có API upload công khai. Tài liệu cần được cho phép gửi tới nhà cung cấp trước khi thêm; tệp trong thư mục bị Git bỏ qua.

Dữ liệu phòng, giá và đặt phòng của demo hiện chỉ nằm trong `localStorage`; dự án chưa có database hay xác thực server-side. Vì vậy, API không gửi dữ liệu trình duyệt không đáng tin cậy cho mô hình và hướng dẫn AI không xác nhận thông tin khách sạn trực tiếp hoặc thực hiện thao tác nghiệp vụ.

## Khởi chạy trên Windows

`start-demo.bat` kiểm tra Python, cài thư viện còn thiếu, tạo `.env` từ mẫu và chỉ mở Notepad khi cần cấu hình API key. Script không cài Ollama hoặc tải mô hình.

## Verification

- `py manage.py test django_server --noinput`: kiểm thử unit/API với nhà cung cấp mock.
- `py manage.py check`: kiểm tra cấu hình Django.
- Kiểm tra JavaScript inline bằng Node.js.
- Chưa xác minh suy luận với API thật nếu chưa có API key.
