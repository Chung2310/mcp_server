import axios from "axios";
import { logger } from "./logger";
import { env } from "./env.config";

/**
 * Gọi API Google Gemini với cơ chế tự động thử lại.
 */
export async function callGemini(prompt: string) {
  if (env.USE_MOCK) {
    return "# System Design\nSample design document.";
  }

  const configs = [
    { version: "v1beta", model: "gemini-2.0-flash" },
    { version: "v1", model: "gemini-pro-latest" },
  ];

  let lastError;

  for (const config of configs) {
    let retries = 0;
    while (retries < 3) {
      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );
        return res.data.candidates[0].content.parts[0].text;
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          logger.warn(`[Gemini] ${config.model} - 429 Quota Exceeded. Retrying in 10s...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          retries++;
          continue;
        }
        
        if (error.response) {
          logger.warn(`[Gemini] ${config.version}/${config.model} - ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
          logger.warn(`[Gemini] ${config.version}/${config.model} - ${error.message}`);
        }
        lastError = error;
        break; // Sang model tiếp theo
      }
    }
  }

  throw new Error(`All Gemini configurations failed. Last error: ${lastError?.message}`);
}
