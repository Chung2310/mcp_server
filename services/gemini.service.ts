import axios from "axios";

/**
 * Gọi API Google Gemini để sinh nội dung dựa trên prompt.
 * Hỗ trợ cơ chế tự động thử lại (retry) qua nhiều phiên bản mô hình khác nhau.
 * @param prompt - Nội dung yêu cầu gửi cho AI.
 * @returns Nội dung văn bản do AI phản hồi.
 * @throws Lỗi nếu tất cả các cấu hình model đều thất bại.
 */
export async function callGemini(prompt: string) {



  const configs = [

    { version: "v1beta", model: "gemini-2.0-flash" },
    { version: "v1", model: "gemini-pro-latest" },
  ];

  let lastError;

  for (const config of configs) {
    let retries = 0;
    while (retries < 5) {
      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          }
        );
        return res.data.candidates[0].content.parts[0].text;
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          console.warn(`[Gemini] ${config.model} - 429 Quota Exceeded. Retrying in 20s...`);
          await new Promise(resolve => setTimeout(resolve, 20000));
          retries++;
          continue;
        }
        
        if (error.response) {
          console.warn(`[Gemini] ${config.version}/${config.model} - ${error.response.status}:`, error.response.data);
        } else {
          console.warn(`[Gemini] ${config.version}/${config.model} - ${error.message}`);
        }
        lastError = error;
        break; // Sang model tiếp theo
      }
    }
  }

  throw new Error(`Tất cả cấu hình Gemini đều thất bại. Lỗi cuối: ${lastError?.message}`);
}
