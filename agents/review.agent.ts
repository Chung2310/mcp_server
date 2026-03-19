import { REVIEW_RULE } from "../rules/review.rule";
import { callDeepSeek } from "../services/deepseek.service";

/**
 * Tác nhân đánh giá: Sử dụng DeepSeek để tối ưu hóa mã nguồn hoặc sửa lỗi.
 * @param devContent - Đối tượng chứa code và ngôn ngữ.
 * @param error - Thông tin lỗi từ Test Agent (tùy chọn).
 */
export async function reviewAgent(devContent: any, error?: string) {
  const prompt = `
${REVIEW_RULE}

Mã nguồn hiện tại (${devContent.language}):
${devContent.code}

${error ? `⚠️ CẢNH BÁO LỖI TỪ TEST AGENT:\n${error}\n\nHãy sửa lỗi trên và tối ưu lại code.` : "Hãy tối ưu hóa mã nguồn này (DeepSeek Optimized)."}

Hãy trả về mã nguồn hoàn chỉnh.
`;

  // Sử dụng mô hình Reasoner (R1) để có tư duy sâu
  const optimizedCode = await callDeepSeek(prompt, true);
  
  return {
    code: optimizedCode,
    language: devContent.language
  };
}
