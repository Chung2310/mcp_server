import axios from "axios";

export async function callOpenAI(messages: any[]) {
  if (process.env.USE_MOCK === "true") {
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
          messages,
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      return res.data.choices[0].message.content;
    } catch (error: any) {
      console.warn(`[OpenAI] Model ${model} thất bại:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`Tất cả model OpenAI đều thất bại. Lỗi cuối: ${lastError?.message}`);
}