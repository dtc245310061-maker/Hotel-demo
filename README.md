# Lumière Hotel AI Demo

Bản demo được trình bày như website công khai của Lumière Hotel; khu quản trị vẫn có sau nút đăng nhập nhân viên. Django phục vụ trang tự chứa `dist/index.html` gồm giao diện, CSS và JavaScript; không cần Node.js, npm hay bước build frontend.

## Chạy trên Windows

Cài Python 3.10 trở lên. Mở `start-demo.bat`, hoặc chạy thủ công:

```powershell
py -m pip install -r requirements.txt
py manage.py runserver 127.0.0.1:8000
```

Mở `http://127.0.0.1:8000/`. Kiểm tra trạng thái Django tại `http://127.0.0.1:8000/api/health/`.

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
- Lumière AI trả lời theo bộ quy tắc trên dữ liệu demo: tìm phòng theo giá/sức chứa, tra dịch vụ, đánh giá, lượt đặt; quản trị có thể hỏi doanh thu và tình trạng phòng.



Chatbot là trợ lý quy tắc chạy trong trình duyệt, không kết nối mô hình AI bên ngoài. Dữ liệu nghiệp vụ và phiên đăng nhập dùng `localStorage`, tài khoản chỉ phục vụ trình diễn; Django hiện phục vụ trang và endpoint health, chưa có cơ sở dữ liệu, xác thực server-side, email thật hay thanh toán. Không dùng `runserver` cho môi trường production.

