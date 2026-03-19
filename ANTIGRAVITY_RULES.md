# 🌌 ANTIGRAVITY PROJECT RULES: mcp-server

Bộ quy tắc tối cao dành cho việc phát triển và vận hành dự án `mcp-server` khi sử dụng Antigravity AI.

## 1. Triết lý Phát triển (Core Philosophy)
- **Resilience First (Ưu tiên Chống chịu):** Hệ thống không bao giờ được phép dừng lại do lỗi API. Luôn phải có phương án Fallback (Dự phòng) đa tầng.
- **Agentic Autonomy (Tự chủ Tác nhân):** Mỗi Agent phải có trách nhiệm rõ ràng, tuân thủ nghiêm ngặt JSON Schema và quy tắc trong `rules/`.
- **DeepSeek Primacy:** DeepSeek R1 là bộ não chính cho tư duy logic. Các model khác đóng vai trò hỗ trợ và dự phòng.

## 2. Kiến trúc Pipeline (Super Pipeline)
Quy trình thực thi phải tuân thủ 5+ bước sau:
1.  **Analysis:** Phân tích yêu cầu -> JSON Task.
2.  **Design:** Tạo `System_Design.md` chi tiết.
3.  **Development:** Viết mã nguồn ban đầu.
4.  **Self-Correction Loop:** Đánh giá -> Kiểm thử -> Sửa lỗi (Lặp lại max 3 lần).
5.  **Documentation & Parallel Export:** Tạo README và xuất file đồng thời.

## 3. Tiêu chuẩn Kỹ thuật (Technical Standards)
- **Ngôn ngữ:** TypeScript (Strict Mode).
- **Môi trường:** Node.js (CommonJS).
- **Cấu trúc:** Modularity (Tách biệt `/agents`, `/services`, `/orchestrator`, `/rules`). Tuân thủ nghiêm ngặt **Backend Gold Standard** (Express, TS, Joi, Centralized Error Handling).
- **Xử lý lỗi:** Sử dụng try-catch toàn diện tại cấp Orchestrator để quản lý Fallback.

## 4. Tương tác với Antigravity (AI Guidelines)
- **Quy trình làm việc:** Luôn bắt đầu bằng `implementation_plan.md` và kết thúc bằng `walkthrough.md`.
- **Giao diện:** Nếu có UI, phải đạt tiêu chuẩn **Premium Design** (Vibrant colors, Glassmorphism, Modern Typography). Không dùng placeholder.
- **Logging:** Tuân thủ hệ thống log Dashboard trong terminal và log file chi tiết tại project output.

## 5. Luật lệ về Dữ liệu (Data Laws)
- **Bảo mật:** Không bao giờ hardcode API Keys. Luôn sử dụng `.env`.
- **Memory:** Sử dụng Sliding Window (Last 3 interactions) kết hợp với `execution.log` để duy trì ngữ cảnh.
- **Output:** Tất cả đầu ra của một lần chạy phải được gom nhóm vào một thư mục slug duy nhất trong `outputs/`.

## 6. Backend Gold Standard (Chi tiết kỹ thuật)
Mọi dự án Backend NodeJS/TypeScript phải triển khai chính xác bộ khung sau:

### 6.1. Xử lý Lỗi (Error Handling)
- **ApiError Class:** Tại \`src/common/utils/ApiError.ts\`, định nghĩa class kế thừa Error với \`statusCode\`.
- **catchAsync Wrapper:** Tại \`src/common/utils/catchAsync.ts\`, bọc mọi hàm async controller để chuyển lỗi vào \`next()\`.
- **errorHandler Middleware:** Tại \`src/common/middlewares/error.middleware.ts\`, trạm cuối xử lý mọi lỗi và trả về JSON chuẩn (\`success\`, \`status\`, \`message\`, \`stack\`).

### 6.2. Validation nghiệp vụ (Joi)
- **validate Middleware:** Sử dụng Joi để kiểm tra dữ liệu trước khi vào Controller. Nếu sai, gọi \`next(new ApiError(400, ...))\`.
- **Schema Separation:** Định nghĩa schema riêng cho từng resource (ví dụ: \`user.validation.ts\`).

### 6.3. Chuẩn hóa Phản hồi (Response Interface)
Sử dụng các interface sau tại \`src/common/interfaces/response.interface.ts\`:
- \`IApiResponse<T>\`: Cho dữ liệu đơn lẻ.
- \`IPaginatedResponse<T>\`: Cho danh sách có phân trang (kèm \`meta\` chứa \`totalItems\`, \`totalPages\`, v.v.).

- \`IPaginatedResponse<T>\`: Cho danh sách có phân trang (kèm \`meta\` chứa \`totalItems\`, \`totalPages\`, v.v.).

## 7. Tiêu chuẩn Enterprise (Bổ sung)
Mọi dự án chuyên nghiệp phải áp dụng thêm các quy tắc sau:

### 7.1. Quản lý Biến môi trường (Env Validation)
- Sử dụng **Zod** để định nghĩa schema cho file \`.env\`.
- Khởi chạy kiểm tra ngay tại \`server.ts\` hoặc \`app.ts\`. Nếu thiếu biến quan trọng, app phải dừng lại và báo lỗi rõ ràng.

### 7.2. Ghi nhật ký (Structured Logging)
- KHÔNG dùng \`console.log\` cho production.
- Sử dụng **Winston** hoặc **Pino** để ghi log có cấu trúc (JSON format).
- Phân chia Level: \`info\` (luồng chạy), \`warn\` (cảnh báo ổn định), \`error\` (lỗi nghiêm trọng).

### 7.3. Tài liệu API (Swagger/OpenAPI)
- Sử dụng \`swagger-jsdoc\` và \`swagger-ui-express\`.
- Mọi Endpoint phải có mô tả rõ ràng về: Summary, Tags, Parameters, Response (200, 400, 500).

### 7.4. Quy trình Git & Commit
- Tuân thủ **Conventional Commits** (ví dụ: \`feat(user): add login endpoint\`).
- Sử dụng **ESLint** và **Prettier** để tự động chuẩn hóa định dạng code.

## 8. Chỉ dẫn cho AI (AI Directives)
Để Antigravity và các AI trợ lý khác tự động áp dụng bộ luật này:
- **Tệp .cursorrules:** Link trực tiếp đến file này để AI luôn có ngữ cảnh (Context Pinning).
- **Phân cấp Tiêu chuẩn:** Mọi code mới phải được đối soát qua \`BACKEND_STRICT_RULE\` trước khi bàn giao.
- **Tự động hóa:** Tích hợp bộ luật vào prompt của từng Agent (Analysis, Dev, Review) để đảm bảo tính nhất quán từ đầu đến cuối.

---
> [!IMPORTANT]
> Mọi thay đổi về mã nguồn hoặc logic đều phải đối chiếu với bộ quy tắc này trước khi thực hiện.
