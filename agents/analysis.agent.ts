import { loadMemory } from "../memory/memory.service";
import { ANALYSIS_RULE } from "../rules/analysis.rule";
import { BACKEND_STRICT_RULE } from "../rules/backend_strict.rule";
import { callDeepSeek } from "../services/deepseek.service";
import { extractJSON } from "../helper/extractJSON";

/**
 * Tác nhân phân tích: Tiếp nhận yêu cầu người dùng và chuyển đổi thành cấu trúc JSON nhiệm vụ.
 * Đã tích hợp Backend Gold Standard để định hướng thiết kế ngay từ đầu.
 * @param prompt - Yêu cầu gốc từ người dùng.
 * @returns Đối tượng JSON chứa tên dự án, nhiệm vụ, tech stack...
 */
export async function analysisAgent(prompt: string) {
  const memory = loadMemory().slice(-3);

  const fullPrompt = `
${ANALYSIS_RULE}

---
YÊU CẦU KỸ THUẬT BACKEND (GOLD STANDARD):
${BACKEND_STRICT_RULE}
---

Previous context:
${JSON.stringify(memory, null, 2)}

User request:
${prompt}
`;

  const res = await callDeepSeek(fullPrompt, true);
  return extractJSON(res);
}