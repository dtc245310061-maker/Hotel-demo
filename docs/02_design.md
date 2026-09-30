# Thiết kế demo Lumière Hotel AI

## Kiến trúc

Demo dùng Django để phục vụ một trang `dist/index.html` tự chứa HTML, CSS và JavaScript thuần. Không cần Node.js, npm, thư viện frontend hoặc bước build. Trạng thái demo lưu trong `localStorage`.

## Vai trò và luồng

- `admin`: dashboard công suất, doanh thu, trạng thái phòng; cập nhật trạng thái phòng; xem đặt phòng; xem bảng giá dịch vụ.
- `guest`: khám phá phòng, lọc phòng, đặt phòng, xem lịch đặt, xem dịch vụ, cài đặt.
- Xác thực demo có login/register/forgot password/logout; tài khoản demo chỉ dùng dữ liệu cục bộ và không được điền sẵn trên giao diện.

## Traceability

| Requirement ID | Design ID | Design Component |
|---|---|---|
| REQ-AUTH | DES-AUTH | Màn hình đăng nhập, sidebar, hồ sơ |
| REQ-ROOM | DES-ROOM | Danh sách phòng, lọc và trạng thái |
| REQ-BOOKING | DES-BOOKING | Modal đặt phòng, lịch đặt, hủy và trả phòng |
| REQ-SERVICE | DES-SERVICE | Bảng giá và quản lý dịch vụ |
| REQ-AI | DES-AI | Trợ lý quy tắc tra dữ liệu demo |
| REQ-UX | DES-UX | CSS responsive, tiếng Việt |

## Skills.sh Evidence

- `frontend-design`: áp dụng cho layout dashboard, trạng thái, responsive và accessibility cơ bản.
- `codebase-design`: áp dụng cho ranh giới component và luồng dữ liệu cục bộ.

STATUS: PASS
NEXT_INPUT: docs/02_design.md
NEXT_PROMPT: prompts/03_implementation_plan.md
TRACEABILITY_MATRIX_UPDATED: YES
