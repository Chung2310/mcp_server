import axios from "axios";

export async function callClaude(prompt: string) {
  if (process.env.USE_MOCK === "true") {
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
            "x-api-key": process.env.CLAUDE_API_KEY!,
            "anthropic-version": "2023-06-01",
          },
        }
      );
      return res.data.content[0].text;
    } catch (error: any) {
      if (error.response) {
        console.warn(`[Claude] Model ${model} thất bại (${error.response.status}):`, JSON.stringify(error.response.data, null, 2));
      } else {
        console.warn(`[Claude] Model ${model} thất bại:`, error.message);
      }
      lastError = error;
    }

  }

  throw new Error(`Tất cả model Claude đều thất bại. Lỗi cuối: ${lastError?.message}`);
}