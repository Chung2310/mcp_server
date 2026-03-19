
import { extractJSON } from "../helper/extractJSON";
import { loadMemory } from "../memory/memory.service";
import { RULES } from "../rules";
import { TEST_RULE } from "../rules/test.rule";
import { callOpenAI } from "../services/openai.service";

export async function testAgent(SPEC: any) {
  const prompt = `
${TEST_RULE}

Previous context:
${JSON.stringify(loadMemory().slice(-3), null, 2)}

DEV:
${JSON.stringify(SPEC, null, 2)}
`;
  const res = await callOpenAI([
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: JSON.stringify(SPEC),
    },
  ]);
  return extractJSON(res);
}