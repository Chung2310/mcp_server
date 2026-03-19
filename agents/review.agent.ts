import { REVIEW_RULE } from "../rules/review.rule";
import { LLMOrchestrator } from "../services/llm.orchestrator";

export async function reviewAgent(devContent: any, error?: string) {
  const prompt = `
${REVIEW_RULE}

Mã nguồn hiện tại (${devContent.language}):
${devContent.code}

${error ? `⚠️ CẢNH BÁO LỖI TỪ TEST AGENT:\n${error}\n\nHãy sửa lỗi trên và tối ưu lại code.` : "Hãy tối ưu hóa mã nguồn này (DeepSeek Optimized)."}

Hãy trả về mã nguồn hoàn chỉnh.
`;

  const optimizedCode = await LLMOrchestrator.callWithFallback(prompt, true);
  
  return {
    code: optimizedCode,
    language: devContent.language
  };
}
