import { loadMemory } from "../memory/memory.service";
import { DEV_RULE } from "../rules/dev.rule";
import { BACKEND_STRICT_RULE } from "../rules/backend_strict.rule";
import { LLMOrchestrator } from "../services/llm.orchestrator";
import { extractJSON } from "../helper/extractJSON";

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

  const res = await LLMOrchestrator.callWithFallback(prompt, true);
  return extractJSON(res);
}