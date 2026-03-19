import axios from "axios";
import { logger } from "./logger";
import { env } from "./env.config";

export async function callOpenAI(prompt: string) {
  if (env.USE_MOCK) {
    return JSON.stringify({ test_result: "Script chạy tốt trên môi trường ảo.", status: "PASSED" });
  }

  const models = ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"];
  let lastError;

  for (const model of models) {
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
        }
      );
      return res.data.choices[0].message.content;
    } catch (error: any) {
      logger.warn(`[OpenAI] Model ${model} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(`All OpenAI models failed. Last error: ${lastError?.message}`);
}