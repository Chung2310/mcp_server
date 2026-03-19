import axios from "axios";
import { logger } from "./logger";
import { env } from "./env.config";

export async function callClaude(prompt: string) {
  if (env.USE_MOCK) {
    return JSON.stringify({ code: "import requests\nprint('Giá vàng SJC: 80,000,000')", language: "python" });
  }

  const models = [
    "claude-3-7-sonnet-20250219",
    "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-latest",
    "claude-3-opus-20240229",
    "claude-3-haiku-20240307"
  ];

  let lastError;

  for (const model of models) {
    try {
      const res = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: model,
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "x-api-key": env.CLAUDE_API_KEY!,
            "anthropic-version": "2023-06-01",
          },
        }
      );
      return res.data.content[0].text;
    } catch (error: any) {
      if (error.response) {
        logger.warn(`[Claude] Model ${model} failed (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else {
        logger.warn(`[Claude] Model ${model} failed: ${error.message}`);
      }
      lastError = error;
    }
  }

  throw new Error(`All Claude models failed. Last error: ${lastError?.message}`);
}