# Lumière Hotel AI Demo

Demo quản lý khách sạn dùng Django, HTML/CSS/JavaScript và Gemini API. Chat gọi Gemini từ backend; API key không được gửi xuống trình duyệt.

## Chạy trên Windows

Cài Python 3.10 trở lên cùng Python Launcher. Mở PowerShell tại thư mục dự án:

```powershell
py --version
.\start-demo.bat
```

Lần đầu, BAT tạo `.env`, cài thư viện còn thiếu và mở Notepad. Trong [Google AI Studio](https://aistudio.google.com/apikey), đăng nhập Google rồi tạo API key. Chỉ tiếp tục nếu tài khoản hiển thị quota Free; không bật billing nếu được yêu cầu. Trong Notepad, thêm key sau `GEMINI_API_KEY=` (không có dấu ngoặc kép), lưu file rồi đóng. BAT mở website tại [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Mở Chat AI; những lần sau chỉ cần chạy lại BAT.

## Tài khoản đăng nhập demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Quản trị | `admin@lumiere.vn` | `admin123` |
| Nhân viên | `nhanvien@lumiere.vn` | `Abc12345` |
| Khách | `guest@lumiere.vn` | `guest123` |

Đây là thông tin đăng nhập mẫu được khai báo trong mã giao diện. Xác thực và dữ liệu demo lưu trên trình duyệt (`localStorage`); không dùng các tài khoản này cho dữ liệu thật.

## Lưu ý

- Mặc định dùng `gemini-2.5-flash`. Google chỉ cấp Free Tier cho một số model/dự án đủ điều kiện; không thể đảm bảo tài khoản có quota miễn phí hoặc quota còn lại. Kiểm tra trong Google AI Studio và [bảng giá](https://ai.google.dev/gemini-api/docs/pricing); không bật billing, nếu được yêu cầu thanh toán thì dừng lại.
- Giữ key trong `.env`; không gửi key qua chat, không đưa vào frontend hoặc GitHub. `.env` được Git ignore.
- Nội dung chat được gửi tới Gemini để tạo câu trả lời. Theo điều khoản Free Tier của Google, dữ liệu có thể được dùng để cải thiện sản phẩm; không nhập thông tin cá nhân hoặc bí mật.
- Dữ liệu phòng, dịch vụ và đặt phòng lưu trong `localStorage`, chưa có database khách sạn backend. Khi tư vấn phòng, giao diện gửi snapshot phòng hiện có tới Django. Nếu Gemini hết quota, Django vẫn lọc phòng `available` theo số khách và ngân sách được nêu; đây là dữ liệu demo, không xác nhận đặt phòng.

## Triển khai demo miễn phí trên Render

`render.yaml` đã cấu hình Django Web Service gói Free, static files và kiểm tra sức khỏe tại `/api/health/`.

1. Đẩy mã nguồn lên repository GitHub của dự án.
2. Trên Render, chọn **New → Blueprint**, kết nối repository và xác nhận Web Service có plan `free`.
3. Khi Render hỏi giá trị `GEMINI_API_KEY`, nhập key trong phần cấu hình bí mật của dịch vụ. Không ghi key vào GitHub hoặc file dự án; không bật billing hay chọn gói trả phí.
4. Sau khi deploy hoàn tất, mở URL `.onrender.com` Render cấp và kiểm tra `/api/health/`. Không chia sẻ đường dẫn cho đến khi trạng thái dịch vụ là Live.

Dịch vụ Free có thể tạm ngừng khi không hoạt động; lần mở đầu sau đó có thể chậm. Dữ liệu demo vẫn nằm trong localStorage của từng trình duyệt.

## Lỗi thường gặp

- **Không nhận lệnh `py`:** cài Python 3.10+ cùng Python Launcher, rồi mở lại PowerShell.
- **Thiếu thư viện:** kiểm tra Internet và chạy `py -m pip install -r requirements.txt`.
- **Thiếu hoặc không hợp lệ API key:** kiểm tra `GEMINI_API_KEY` trong `.env`; lưu file rồi dừng/chạy lại BAT.
- **Gemini bị giới hạn/quota:** câu hỏi phòng vẫn được lọc từ snapshot nếu có đủ số khách và ngân sách; câu hỏi khác cần đợi quota được làm mới và kiểm tra Google AI Studio.
- **Cổng 8000 đang được dùng:** đóng tiến trình đang sử dụng cổng hoặc giải phóng cổng rồi chạy lại BAT.
