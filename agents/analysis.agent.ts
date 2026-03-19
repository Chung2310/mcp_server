import { loadMemory } from "../memory/memory.service";
import { ANALYSIS_RULE } from "../rules/analysis.rule";
import { BACKEND_STRICT_RULE } from "../rules/backend_strict.rule";
import { LLMOrchestrator } from "../services/llm.orchestrator";
import { extractJSON } from "../helper/extractJSON";

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

  const res = await LLMOrchestrator.callWithFallback(fullPrompt, true);
  return extractJSON(res);
}