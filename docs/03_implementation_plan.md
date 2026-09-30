# Kế hoạch triển khai demo

| Task ID | Requirement ID | Design ID | Objective | Verification |
|---|---|---|---|---|
| TASK-01 | REQ-AUTH | DES-AUTH | Dựng xác thực và session demo | kiểm tra luồng HTTP/UI |
| TASK-02 | REQ-ROOM | DES-ROOM | Dựng phòng, lọc và trạng thái | kiểm tra thao tác UI |
| TASK-03 | REQ-BOOKING | DES-BOOKING | Dựng modal và lịch đặt phòng | kiểm tra tạo booking |
| TASK-04 | REQ-SERVICE | DES-SERVICE | Dựng danh sách dịch vụ và giá | kiểm tra render |
| TASK-05 | REQ-AI, REQ-UX | DES-AI, DES-UX | Dựng trợ lý theo dữ liệu, responsive và tài liệu | kiểm tra chatbot trên HTTP |

## Dependency

`TASK-01` là nền tảng; `TASK-02`, `TASK-04` có thể phát triển song song; `TASK-03` phụ thuộc `TASK-01` và `TASK-02`; `TASK-05` chạy sau khi các màn hình chính ổn định.

## Skills.sh Evidence

Kiểm chứng theo luồng Python/Django HTTP và thao tác giao diện trong trình duyệt; không có bước build frontend.

STATUS: PASS
NEXT_INPUT: docs/03_implementation_plan.md
NEXT_PROMPT: prompts/04_implementation.md
TRACEABILITY_MATRIX_UPDATED: YES
