import { DOC_RULE } from "../rules/doc.rule";
import { LLMOrchestrator } from "../services/llm.orchestrator";

export async function docAgent(analysis: any, dev: any) {
  const prompt = `
${DOC_RULE}

Dựa trên phân tích:
${JSON.stringify(analysis, null, 2)}

Và code đã viết:
${dev.code}

Hãy tạo một file README.md cho dự án này.
`;

  return await LLMOrchestrator.callWithFallback(prompt);
}
