# Lumière Hotel AI Demo

Demo quản lý khách sạn dùng Django, HTML/CSS/JavaScript và Gemini API. Chat gọi Gemini từ backend; API key không được gửi xuống trình duyệt.

## Chạy trên Windows

Cài Python 3.10 trở lên cùng Python Launcher. Mở PowerShell tại thư mục dự án:

```powershell
py --version
.\start-demo.bat
```

Lần đầu, BAT tạo `.env`, cài thư viện còn thiếu và mở Notepad. Tạo API key trong [Google AI Studio](https://aistudio.google.com/apikey), điền vào `GEMINI_API_KEY=` trong `.env`, lưu rồi đóng Notepad. BAT khởi chạy website tại [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Mở Chat AI trong website; những lần sau chỉ cần chạy lại BAT.

## Render

Trong Render, chọn **New > Blueprint** và repository này. `render.yaml` đã đặt loại **Web Service**, `plan: free`, không tạo database và khai báo `GEMINI_API_KEY` là biến bí mật cần nhập riêng. Trước khi xác nhận, kiểm tra màn hình chỉ hiển thị gói **Free**; không nâng cấp service, không thêm database và không thêm phương thức thanh toán. Nếu Render yêu cầu chọn gói trả phí hoặc nhập phương thức thanh toán, dừng lại.

Nhập API key của bạn vào ô `GEMINI_API_KEY` trong Environment rồi tạo/deploy service. Không đưa key vào GitHub hoặc trình duyệt. Chỉ mở URL `.onrender.com` Render cấp sau khi deploy xong; kiểm tra URL đó cùng `/api/health/`. Chưa có service/URL triển khai thực tế được xác nhận. Free Web Service có thể ngủ sau 15 phút không hoạt động và mất khoảng một phút để thức dậy; giới hạn Free của Render có thể làm service tạm ngưng hoặc không nhận deploy mới.

## Lưu ý

- Mặc định dùng `gemini-2.5-flash`, được Google liệt kê có Free Tier tại thời điểm kiểm tra. Hạn mức và điều kiện áp dụng phụ thuộc tài khoản, có thể thay đổi; xác nhận trong Google AI Studio và xem [bảng giá](https://ai.google.dev/gemini-api/docs/pricing) cùng [hạn mức](https://ai.google.dev/gemini-api/docs/rate-limits). Chỉ dùng khi tài khoản có Free Tier; không kích hoạt thanh toán hoặc paid tier. Nếu tài khoản yêu cầu bật thanh toán để gọi model, không tiếp tục.
- Giữ key trong `.env` hoặc secret Environment trên Render; không gửi key qua chat, không đưa vào frontend hoặc GitHub. `.env` được Git ignore.
- Nội dung chat được gửi tới Gemini để tạo câu trả lời. Theo điều khoản Free Tier của Google, dữ liệu có thể được dùng để cải thiện sản phẩm; không nhập thông tin cá nhân hoặc bí mật.
- Dữ liệu phòng, dịch vụ và đặt phòng chỉ lưu trong `localStorage` của trình duyệt. Chưa có database khách sạn ở backend; Chat AI không thể tra cứu dữ liệu đó.

## Lỗi thường gặp

- **Không nhận lệnh `py`:** cài Python 3.10+ cùng Python Launcher, rồi mở lại PowerShell.
- **Thiếu thư viện:** kiểm tra Internet và chạy `py -m pip install -r requirements.txt`.
- **Thiếu hoặc không hợp lệ API key:** kiểm tra `GEMINI_API_KEY` trong `.env` hoặc Environment trên Render; khởi động lại Django sau khi sửa.
- **Đã chạm hạn mức:** xem quota của Gemini API và đợi hạn mức được làm mới.
- **Cổng 8000 đang được dùng:** đóng tiến trình đang sử dụng cổng hoặc giải phóng cổng rồi chạy lại BAT.
