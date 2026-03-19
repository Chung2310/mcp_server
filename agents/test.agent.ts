import { extractJSON } from "../helper/extractJSON";
import { loadMemory } from "../memory/memory.service";
import { TEST_RULE } from "../rules/test.rule";
import { callDeepSeek } from "../services/deepseek.service";

/**
 * Tác nhân kiểm thử: Nhận mã nguồn và thực hiện kiểm thử logic.
 * @param SPEC - Dữ liệu mã nguồn cần kiểm thử.
 * @returns Kết quả kiểm thử (PASSED/FAILED) và chi tiết.
 */
export async function testAgent(SPEC: any) {
  const prompt = `
${TEST_RULE}

Previous context:
${JSON.stringify(loadMemory().slice(-3), null, 2)}

DEV CONTENT:
${JSON.stringify(SPEC, null, 2)}
`;

  const res = await callDeepSeek(prompt, false);
  return extractJSON(res);
}