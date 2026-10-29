# Lumière Hotel AI Demo

Bản demo website Lumière Hotel dùng Django và một trang giao diện tự chứa `dist/index.html`. Không cần Node.js hay npm. Dữ liệu quản lý khách sạn vẫn là dữ liệu demo lưu trong trình duyệt; Chat AI chạy mô hình ngôn ngữ cục bộ bằng Ollama, không cần OpenAI API key và không tính phí API theo câu hỏi.

## Chạy lần đầu trên Windows

### 1. Cài Ollama

Tải Ollama từ [ollama.com/download/windows](https://ollama.com/download/windows), cài đặt rồi để Ollama chạy nền. Script bên dưới sẽ kiểm tra Ollama và tự tải mô hình nếu máy chưa có.

Mô hình mặc định là `qwen2.5:3b`, chọn theo máy phát triển có RAM 16 GB và GPU RTX 3050 Ti 4 GB. Mô hình cần tải khoảng vài GB; tốc độ trả lời phụ thuộc máy và có thể chạy bằng CPU nếu GPU không đủ bộ nhớ. Đóng ứng dụng nặng trước khi dùng nếu máy còn ít RAM trống.

### 2. Cài Python và khởi động

Cài Python 3.10 trở lên, bảo đảm lệnh `py` dùng được, rồi mở `start-demo.bat` trong thư mục dự án. Hoặc mở PowerShell tại thư mục dự án và chạy một lệnh:

```powershell
.\start-demo.bat
```

Script sẽ tự tạo `.env` từ `.env.example` nếu cần, cài thư viện Python còn thiếu, khởi động Ollama, tải `qwen2.5:3b` nếu chưa có, kiểm tra Django rồi mở website tại `http://127.0.0.1:8000/`. Lần đầu có thể chờ trong lúc tải mô hình; chỉ sau khi tải thành công script mới báo AI sẵn sàng và mở website.

Nếu chưa cài Ollama, script sẽ dừng và hướng dẫn cài. Cần kết nối Internet trong lần đầu để cài thư viện/tải mô hình. Sau khi cài ban đầu, các lần chạy tiếp theo chỉ cần mở BAT, không cần nhập API key.

### 3. Cấu hình tùy chọn

Chế độ mặc định `AI_PROVIDER=ollama` dùng `OLLAMA_BASE_URL=http://127.0.0.1:11434` và `OLLAMA_MODEL=qwen2.5:3b`. Các giá trị mẫu nằm trong `.env`; có thể đổi `OLLAMA_MODEL` sang mô hình Ollama khác, rồi chạy lại BAT để tải mô hình đó.

Người muốn dùng API hosted có thể đổi `AI_PROVIDER=openai` và cấu hình `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL` trong `.env`. Chế độ này cần API key riêng và có thể phát sinh phí theo chính sách nhà cung cấp. Không nhập API key vào giao diện chat; không chia sẻ hoặc commit `.env`.

## Tài khoản đăng nhập demo

| Vai trò | Tên | Email | Mật khẩu |
|---|---|---|---|
| Quản trị viên | Lê Thu Thùy | `admin@lumiere.vn` | `admin123` |
| Nhân viên chính | Nguyễn Tuấn Anh | `nhanvien@lumiere.vn` | `Abc12345` |
| Khách hàng | Nguyễn Minh Anh | `guest@lumiere.vn` | `guest123` |

Các tài khoản chỉ dùng để trình diễn local; không dùng lại mật khẩu này cho dịch vụ thật. Nhân viên ảo demo không cần đăng nhập.

## Chức năng và giới hạn

- Đăng nhập theo vai trò, dashboard, phòng, đặt phòng, dịch vụ, vận hành, báo cáo, hồ sơ và đánh giá.
- Chat AI hỗ trợ câu hỏi mở, kiến thức chung và hội thoại tự nhiên; gửi các tin nhắn trước để duy trì ngữ cảnh trong phiên.
- API chat chỉ kết nối tới Ollama trên localhost ở chế độ local. Tin nhắn giới hạn kích thước, lịch sử và tốc độ; một số thông tin liên hệ/nhạy cảm được ẩn trước khi gửi mô hình.
- Dữ liệu phòng, giá, dịch vụ và đặt phòng của demo nằm trong `localStorage`, chưa có database hoặc xác thực server-side. Vì vậy AI không thể xác minh số phòng trống, giá hiện thời hay đặt phòng từ nguồn dữ liệu server và không thực hiện thao tác nghiệp vụ.
- Đây là demo local, không dùng `runserver` cho môi trường production.

Kiểm tra Django tại `http://127.0.0.1:8000/api/health/`.
