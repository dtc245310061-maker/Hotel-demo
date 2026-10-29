# Lumière Hotel AI Demo

Bản demo dùng Django và giao diện tự chứa tại `dist/index.html`; không cần Node.js hoặc npm. Chat AI mặc định gọi mô hình trực tuyến qua OpenAI API từ backend Django, không cài Ollama và không tải mô hình AI về máy.

## Chạy lần đầu trên Windows

### 1. Cài Python

Cài Python 3.10 trở lên, chọn cài Python Launcher để dùng được lệnh `py`.

### 2. Cấu hình API key một lần

Mở [start-demo.bat](./start-demo.bat). Nếu thiếu `.env`, chương trình tự tạo từ [.env.example](./.env.example). Nếu chưa thấy API key, BAT mở tệp `.env` bằng Notepad. Điền key vào dòng `OPENAI_API_KEY=`, lưu tệp rồi đóng Notepad. Không gửi key cho chatbot, không đưa key lên giao diện hoặc commit `.env`.

Bạn cần tự tạo/cung cấp API key trong tài khoản OpenAI hoặc nhà cung cấp tương thích. API trực tuyến có thể tính phí theo token và có thể yêu cầu phương thức thanh toán hoặc hạn mức hoạt động; kiểm tra chính sách hiện hành của nhà cung cấp trước khi sử dụng. Mã nguồn không chứa key mẫu có thể dùng thật.

### 3. Khởi chạy website

Mở lại [start-demo.bat](./start-demo.bat) hoặc chạy trong PowerShell từ thư mục dự án:

```powershell
.\start-demo.bat
```

BAT kiểm tra Python, cài các thư viện còn thiếu, kiểm tra cấu hình Django và mở website tại [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Chat AI gọi API thật sau khi có key hợp lệ. Nếu chưa có key, website vẫn chạy nhưng chat báo cần cấu hình; không tạo câu trả lời giả.

Các lần sau chỉ cần mở BAT. Key được đọc từ `.env` ở thư mục dự án khi Django khởi động, không phải nhập lại trong mỗi cuộc trò chuyện. Nếu thay key khi server đang chạy, hãy dừng cửa sổ Django bằng `Ctrl+C` và mở BAT lại.

## Chat AI và tài liệu

- Chat xử lý câu hỏi mở, kiến thức chung, giải thích, tóm tắt và câu hỏi tiếp nối; lịch sử hội thoại được gửi theo phiên để giữ ngữ cảnh.
- Lỗi key thiếu/sai, hạn mức, timeout và kết nối được hiển thị rõ. Hệ thống giới hạn 2.000 ký tự/tin nhắn, 24 tin nhắn lịch sử, 600 token phản hồi và 10 yêu cầu/phút/IP. Chi phí thực tế vẫn do nhà cung cấp tính theo model và token đầu vào/đầu ra.
- Có thể cho AI tra cứu tài liệu bằng cách đặt tài liệu được phép sử dụng trực tiếp trong [knowledge_base/](./knowledge_base/). Hỗ trợ PDF, DOCX, TXT, Markdown; giới hạn 10 MB/tệp, 25 MB tổng cộng và 50 tệp. Hệ thống trích đoạn liên quan, chia đoạn và ưu tiên nội dung đó khi trả lời; tên tệp nguồn được đưa vào ngữ cảnh để AI nêu nguồn.
- Đây là thư mục cục bộ do người quản trị dự án quản lý, chưa có giao diện tải lên/quản trị tài liệu. Các tệp tài liệu trong thư mục bị Git bỏ qua; chỉ thêm tài liệu được phép gửi tới nhà cung cấp AI. Khi tìm không thấy đoạn liên quan, trợ lý cần nêu rõ giới hạn, không khẳng định tài liệu có nội dung đó.
- Không gửi mật khẩu, thông tin thanh toán hoặc dữ liệu cá nhân không cần thiết. Một số dạng email, số điện thoại và số thẻ được lọc ở backend, nhưng bộ lọc không thể nhận diện mọi thông tin nhạy cảm.

## Phạm vi dữ liệu khách sạn

Phần đăng nhập/đăng ký, phòng, dịch vụ, đặt phòng và báo cáo là dữ liệu demo phía trình duyệt lưu trong `localStorage`. Django hiện chỉ phục vụ trang, health check và API chat; chưa có database hoặc xác thực server-side. Vì vậy AI không tra cứu được giá/tồn phòng/đặt phòng trực tiếp, và không đặt, hủy hay thay đổi nghiệp vụ. Không dùng tài khoản hoặc dữ liệu demo như dữ liệu vận hành thật. README không công bố mật khẩu demo.

## Khắc phục sự cố

- **Chat báo thiếu API key:** mở `.env`, điền `OPENAI_API_KEY=...`, lưu rồi khởi động lại BAT.
- **API key sai/không có quyền:** kiểm tra key, tài khoản, model và quyền API ở nhà cung cấp; không dán key vào cửa sổ chat hoặc log.
- **Hết hạn mức/lỗi thanh toán:** kiểm tra usage, billing/hạn mức và giới hạn chi phí ở tài khoản API.
- **Lỗi kết nối/timeout:** kiểm tra Internet, firewall/proxy và `OPENAI_BASE_URL`; thử gửi lại.
- **Thiếu Python hoặc thư viện:** cài Python 3.10+, bảo đảm lệnh `py` hoạt động, rồi chạy lại BAT. Lỗi tải thư viện cần kết nối Internet.
- **Cổng 8000 đang bận:** đóng server Django khác hoặc ứng dụng đang dùng cổng 8000 rồi mở lại BAT.
- **Kiểm tra Django:** mở [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/); phản hồi bình thường có `status: ok`.

Không dùng `runserver` cho môi trường production. Đăng nhập và dữ liệu nghiệp vụ của bản demo không có bảo vệ server-side.
