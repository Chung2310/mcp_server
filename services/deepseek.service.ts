import axios from "axios";

/**
 * Gọi API DeepSeek để xử lý nội dung.
 * @param prompt - Nội dung yêu cầu.
 * @param isReasoner - Sử dụng mô hình deepseek-reasoner (R1) hay deepseek-chat.
 * @returns Nội dung phản hồi từ DeepSeek.
 */
export async function callDeepSeek(prompt: string, isReasoner: boolean = false) {
  const apiKey = process.env.DEEP_SEEK_API_KEY;
  if (!apiKey) throw new Error("DEEP_SEEK_API_KEY chưa được thiết lập.");

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
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (error: any) {
    if (error.response) {
      console.error("[DeepSeek] Error Status:", error.response.status);
      console.error("[DeepSeek] Error Data:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}
