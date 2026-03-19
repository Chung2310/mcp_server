import { loadMemory } from "../memory/memory.service";
import { ANALYSIS_RULE } from "../rules/analysis.rule";
import { callGemini } from "../services/gemini.service";
import { extractJSON } from "../helper/extractJSON";

export async function analysisAgent(prompt: string) {
  const memory = loadMemory().slice(-3); // lấy 3 lần gần nhất

  const fullPrompt = `
${ANALYSIS_RULE}

Previous context:
${JSON.stringify(memory, null, 2)}

User request:
${prompt}
`;

  const res = await callGemini(fullPrompt);
  return extractJSON(res);
}