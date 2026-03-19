import { ANALYSIS_DOC_RULE } from "../rules/analysis-doc.rule";
import { callDeepSeek } from "../services/deepseek.service";

export async function analysisDocAgent(analysis: any) {
  const prompt = `
${ANALYSIS_DOC_RULE}

Dữ liệu phân tích JSON:
${JSON.stringify(analysis, null, 2)}

Hãy tạo bản thiết kế hệ thống chi tiết.
`;

  return await callDeepSeek(prompt);
}
