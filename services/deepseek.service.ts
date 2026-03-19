import axios from "axios";
import { logger } from "./logger";
import { env } from "./env.config";

/**
 * Gọi API DeepSeek để xử lý nội dung.
 */
export async function callDeepSeek(prompt: string, isReasoner: boolean = false) {
  if (env.USE_MOCK) {
    return JSON.stringify({ 
      analysis: "Đây là kết quả phân tích mẫu.", 
      tasks: ["Task 1", "Task 2"] 
    });
  }

  if (!env.DEEP_SEEK_API_KEY) throw new Error("DEEP_SEEK_API_KEY chưa được thiết lập.");

  const model = isReasoner ? "deepseek-reasoner" : "deepseek-chat";

  try {
    const res = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.DEEP_SEEK_API_KEY}`,
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (error: any) {
    if (error.response) {
      logger.error(`[DeepSeek] Error Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}
