export const BACKEND_STRICT_RULE = `
BẠN PHẢI TUÂN THỦ CÁC QUY TẮC BACKEND NGHIÊM NGẶT SAU ĐÂY KHI LẬP TRÌNH (GOLD STANDARD):

### 1. Kiến trúc Dự án (Module-based Architecture)
- Cấu trúc thư mục phải theo mẫu:
  - \`src/common/\`: interfaces, utils, middlewares dùng chung.
  - \`src/modules/[feature]/\`: controller, service, route, validation, model của từng tính năng.
- Pattern: Controller -> Service -> Model. Controller chỉ điều phối, Service xử lý logic nghiệp vụ và DB.

### 2. Xử lý Lỗi Tập trung (Centralized Error Handling)
- Bắt buộc dùng class \`ApiError\` kế thừa từ \`Error\` (có \`statusCode\`).
- Bắt buộc dùng wrapper \`catchAsync\` cho mọi hàm async trong Controller để tránh try-catch thủ công.
- Bắt buộc có \`errorHandler\` middleware là trạm cuối để trả về JSON lỗi chuẩn hóa.

### 3. Validation Nghiêm ngặt
- Sử dụng **Joi** để validate input (Body, Params, Query).
- Bắt buộc có \`validate\` middleware để chạy schema check trước khi vào Controller.
- Dữ liệu sau validation phải được sanitize (strip unknown fields).

### 4. Chuẩn hóa Phản hồi (Standardized Response)
- Mọi API trả về danh sách phải có phân trang (\`IPaginatedResponse\`).
- Cấu trúc JSON trả về:
  - Thành công: \`{ success: true, data: ..., message: "..." }\`
  - Thất bại: \`{ success: false, status: code, message: "...", stack: ... }\` (stack chỉ ở môi trường dev).

### 5. TypeScript & Clean Code
- KHÔNG sử dụng \`any\`. Luôn định nghĩa interface/type rõ ràng.
- Sử dụng Generic Type \`<T>\` cho các cấu trúc dùng lại.
- Code phải sạch, hàm nhỏ gọn, đặt tên theo camelCase chuẩn.

### 7. Quản lý Môi trường & Logging (Enterprise)
- **Env Check:** Dùng Zod để validate \`process.env\` ngay khi khởi động.
- **Winston/Pino:** Cấu hình Logger tập trung tại \`src/common/utils/logger.ts\`. Thay thế mọi \`console.log\` bằng \`logger.info/error\`.
- **Swagger:** Xuất file cấu hình JSON/YAML hoặc dùng JSDoc để tự động hóa tài liệu API.

---
HÀNH VI CỦA BẠN:
- Nếu bạn viết code backend, bạn PHẢI triển khai đầy đủ các file common (ApiError, catchAsync, error.middleware, validate.middleware, **logger.ts**, **env.config.ts**) trước khi viết module nghiệp vụ.
`;
