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

Tạo Web Service từ repository bằng **New > Blueprint**. Trong Environment, thêm `GEMINI_API_KEY` với key của chủ dự án, rồi deploy. Sau khi deploy, kiểm tra `/api/health/` trên URL Render; chưa có URL deploy nào được xác nhận trong README này.

## Lưu ý

- Mặc định dùng `gemini-2.5-flash`. Gemini API có Free Tier nhưng hạn mức model/tài khoản có thể thay đổi; xem [bảng giá](https://ai.google.dev/gemini-api/docs/pricing) và [hạn mức](https://ai.google.dev/gemini-api/docs/rate-limits) hiện hành. Không bật thanh toán nếu muốn tránh phát sinh phí.
- Giữ key trong `.env` hoặc secret Environment trên Render; không gửi key qua chat, không đưa vào frontend hoặc GitHub. `.env` được Git ignore.
- Nội dung chat được gửi tới Gemini để tạo câu trả lời. Theo điều khoản Free Tier của Google, dữ liệu có thể được dùng để cải thiện sản phẩm; không nhập thông tin cá nhân hoặc bí mật.
- Dữ liệu phòng, dịch vụ và đặt phòng chỉ lưu trong `localStorage` của trình duyệt. Chưa có database khách sạn ở backend; Chat AI không thể tra cứu dữ liệu đó.

## Lỗi thường gặp

- **Không nhận lệnh `py`:** cài Python 3.10+ cùng Python Launcher, rồi mở lại PowerShell.
- **Thiếu thư viện:** kiểm tra Internet và chạy `py -m pip install -r requirements.txt`.
- **Thiếu hoặc không hợp lệ API key:** kiểm tra `GEMINI_API_KEY` trong `.env` hoặc Environment trên Render; khởi động lại Django sau khi sửa.
- **Đã chạm hạn mức:** xem quota của Gemini API và đợi hạn mức được làm mới.
- **Cổng 8000 đang được dùng:** đóng tiến trình đang sử dụng cổng hoặc giải phóng cổng rồi chạy lại BAT.
