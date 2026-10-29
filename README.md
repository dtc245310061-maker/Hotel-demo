# Lumière Hotel AI Demo

Bản demo quản lý khách sạn với giao diện HTML/CSS/JavaScript, backend Django và Chat AI dùng OpenAI API. Chat gọi API từ backend; không cần cài Ollama.

## Chạy trên Windows

Cài Python 3.10 trở lên và Python Launcher. Mở PowerShell tại thư mục dự án:

```powershell
py --version
py -m pip install -r requirements.txt
if (!(Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Trong `.env`, điền API key vào `OPENAI_API_KEY=`, lưu file. Chỉ cần cấu hình một lần. Sau đó khởi chạy:

```powershell
.\start-demo.bat
```

BAT kiểm tra môi trường, cài thư viện còn thiếu và mở website tại [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Đăng nhập vào demo rồi mở **Lumière AI** để trò chuyện. API health check: [http://127.0.0.1:8000/api/health/](http://127.0.0.1:8000/api/health/).

## Lưu ý

- Cần tự cung cấp OpenAI API key. Việc sử dụng API có thể phát sinh phí theo model và lượng token; kiểm tra hạn mức, thanh toán của tài khoản.
- Giữ key trong `.env`; không chia sẻ, đưa vào giao diện hoặc commit lên Git. Không có key, website vẫn chạy nhưng Chat AI không hoạt động.
- Dữ liệu phòng, dịch vụ và đặt phòng của demo lưu trong `localStorage` trên trình duyệt. Backend hiện chưa có database khách sạn, nên Chat AI không tra cứu được dữ liệu đó.

## Lỗi thường gặp

- **Không nhận lệnh `py`:** cài Python 3.10+ cùng Python Launcher, rồi mở lại PowerShell.
- **Thiếu thư viện:** kiểm tra Internet và chạy lại `py -m pip install -r requirements.txt`.
- **Chat báo thiếu key hoặc key không hợp lệ:** kiểm tra dòng `OPENAI_API_KEY=` trong `.env`; sau khi sửa, dừng server bằng `Ctrl+C` rồi chạy lại BAT.
- **Cổng 8000 đang được dùng:** dừng ứng dụng khác đang dùng cổng này rồi chạy lại `.\start-demo.bat`.
