import { extractJSON } from "../helper/extractJSON";
import { loadMemory } from "../memory/memory.service";
import { TEST_RULE } from "../rules/test.rule";
import { LLMOrchestrator } from "../services/llm.orchestrator";

export async function testAgent(SPEC: any) {
  const prompt = `
${TEST_RULE}

Previous context:
${JSON.stringify(loadMemory().slice(-3), null, 2)}

DEV CONTENT:
${JSON.stringify(SPEC, null, 2)}
`;

  const res = await LLMOrchestrator.callWithFallback(prompt, false);
  return extractJSON(res);
}