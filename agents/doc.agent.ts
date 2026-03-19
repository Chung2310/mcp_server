import { DOC_RULE } from "../rules/doc.rule";
import { callDeepSeek } from "../services/deepseek.service";

export async function docAgent(analysis: any, dev: any) {
  const prompt = `
${DOC_RULE}

Dựa trên phân tích:
${JSON.stringify(analysis, null, 2)}

Và code đã viết:
${dev.code}

Hãy tạo một file README.md cho dự án này.
`;

  return await callDeepSeek(prompt);
}
