# Lumière Hotel AI Demo

Bản demo được trình bày như website công khai của Lumière Hotel; khu quản trị vẫn có sau nút đăng nhập nhân viên. Django phục vụ trang tự chứa `dist/index.html` gồm giao diện, CSS và JavaScript; không cần Node.js, npm hay bước build frontend.

## Chạy trên Windows

Cài Python 3.10 trở lên. Có thể mở `start-demo.bat` để chạy nhanh. Hoặc mở PowerShell tại thư mục dự án và chạy lần lượt:

```powershell
py -m pip install -r requirements.txt
```

Để bật Chat AI, tạo `.env` từ tệp mẫu (nếu chưa có), rồi mở tệp:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Trong `.env`, thay dòng `OPENAI_API_KEY=` bằng API key của bạn, ví dụ `OPENAI_API_KEY=sk-...`; không nhập key vào giao diện chat. Django tự đọc `.env` ở thư mục gốc khi khởi động nên chỉ cần cấu hình một lần. Có thể giữ nguyên `OPENAI_MODEL` và `OPENAI_BASE_URL` theo tệp mẫu hoặc thay bằng giá trị của nhà cung cấp tương thích. Không chia sẻ hoặc commit `.env`.

Bạn cần tự cung cấp API key từ nhà cung cấp mô hình. Tài khoản API có thể cần bật billing hoặc có hạn mức sử dụng; điều kiện và chi phí do nhà cung cấp quyết định. Nếu chưa có key, ứng dụng vẫn chạy nhưng Chat AI sẽ yêu cầu cấu hình.

Khởi động Django:

```powershell
py manage.py runserver 127.0.0.1:8000
```

Mở `http://127.0.0.1:8000/`. Kiểm tra trạng thái Django tại `http://127.0.0.1:8000/api/health/`.

Chat AI dùng OpenAI SDK với `OPENAI_MODEL` và `OPENAI_BASE_URL` từ `.env` hoặc biến môi trường. API key chỉ được đọc ở backend và không gửi xuống trình duyệt. Nếu key thiếu/sai, hết hạn mức hoặc mất kết nối, chat hiển thị hướng dẫn/lỗi thay vì câu trả lời giả lập.

## Tài khoản đăng nhập demo

| Vai trò | Tên | Email | Mật khẩu |
|---|---|---|---|
| Quản trị viên | Lê Thu Thùy | `admin@lumiere.vn` | `admin123` |
| Nhân viên chính | Nguyễn Tuấn Anh | `nhanvien@lumiere.vn` | `Abc12345` |
| Khách hàng | Nguyễn Minh Anh | `guest@lumiere.vn` | `guest123` |

Lưu ý: các nhân viên ảo demo không cần tài khoản đăng nhập. Chúng chỉ xuất hiện trong danh sách quản lý nhân viên và có thể được admin cấp quyền truy cập trong mục nhân viên.

Các tài khoản trên chỉ dùng để trình diễn local; không dùng lại mật khẩu này cho dịch vụ thật.

## Chức năng demo

- Đăng nhập theo vai trò, đăng ký khách hàng, mô phỏng quên mật khẩu, đăng xuất và cài đặt hồ sơ.
- Dashboard, danh sách và trạng thái phòng; quản trị có thể thêm/sửa phòng và giá.
- Đặt phòng, chọn ngày/số khách/dịch vụ, xem và hủy lượt đặt; quản trị có thể cập nhật trạng thái và trả phòng.
- Bảng giá dịch vụ, yêu cầu vận hành, trạng thái thanh toán, doanh thu mẫu, nhân viên và đánh giá.
- Lumière AI hỗ trợ hội thoại đa chủ đề và dùng lịch sử câu hỏi trong phiên để trả lời tiếp nối; giao diện có trạng thái chờ, báo lỗi, gửi lại và tạo cuộc trò chuyện mới.



Chat sử dụng mô hình AI thật khi đã cấu hình API key hợp lệ và có kết nối nhà cung cấp. Các phòng, giá, đặt phòng và dịch vụ của demo vẫn chỉ lưu trong `localStorage`; Django chưa có cơ sở dữ liệu hoặc xác thực server-side nên AI không thể xác minh thông tin khách sạn trực tiếp, và sẽ nêu rõ giới hạn này thay vì tự bịa. Chat giới hạn tin nhắn, tốc độ gửi, thời gian chờ và loại bỏ một số dạng thông tin liên hệ/nhạy cảm trước khi gửi đến mô hình; không nhập thông tin cá nhân hoặc thanh toán vào chat. Tài khoản demo chỉ dùng cho trình diễn; Django chưa có email thật hay thanh toán. Không dùng `runserver` cho môi trường production.
