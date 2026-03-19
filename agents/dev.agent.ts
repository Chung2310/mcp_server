import { loadMemory } from "../memory/memory.service";
import { DEV_RULE } from "../rules/dev.rule";
import { BACKEND_STRICT_RULE } from "../rules/backend_strict.rule";
import { callDeepSeek } from "../services/deepseek.service";
import { extractJSON } from "../helper/extractJSON";

/**
 * Tác nhân phát triển: Nhận bản thiết kế và viết mã nguồn.
 * Bổ sung quy tắc Backend Nghiêm ngặt để đảm bảo chất lượng.
 * @param SPEC - Bản thiết kế từ Analysis Agent.
 * @returns Đối tượng chứa mã nguồn và ngôn ngữ.
 */
export async function devAgent(SPEC: any) {
  const memory = loadMemory().slice(-3);
    
  const prompt = `
${DEV_RULE}

---
BỘ QUY TẮC BACKEND NGHIÊM NGẶT (GOLD STANDARD):
${BACKEND_STRICT_RULE}
---

Previous context:
${JSON.stringify(memory, null, 2)}

SPEC:
${JSON.stringify(SPEC, null, 2)}
`;

  const res = await callDeepSeek(prompt, true);
  return extractJSON(res);
}