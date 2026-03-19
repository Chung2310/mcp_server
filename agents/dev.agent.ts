import { loadMemory } from "../memory/memory.service";
import { DEV_RULE } from "../rules/dev.rule";
import { callClaude } from "../services/claude.service";
import { extractJSON } from "../helper/extractJSON";

export async function devAgent(SPEC: any) {
  const memory = loadMemory().slice(-3);
    
  const prompt = `
${DEV_RULE}

Previous context:
${JSON.stringify(memory, null, 2)}

SPEC:
${JSON.stringify(SPEC, null, 2)}
`;

  const res = await callClaude(prompt);
  return extractJSON(res);
}