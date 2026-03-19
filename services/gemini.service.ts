import axios from "axios";

export async function callGemini(prompt: string) {
  if (process.env.USE_MOCK === "true") {
    return JSON.stringify({ 
      project_name: "sjc-gold-scraper",
      analysis: "Cần một script Python cào giá vàng SJC.", 
      tasks: ["crawling", "formatting"] 
    });
  }



  const configs = [

    { version: "v1", model: "gemini-2.5-flash" },
    { version: "v1", model: "gemini-2.0-flash-lite" },
    { version: "v1", model: "gemini-1.5-pro" },
    { version: "v1", model: "gemini-1.5-flash" },
    { version: "v1beta", model: "gemini-1.5-flash" },
    { version: "v1", model: "gemini-1.0-pro" },
    { version: "v1", model: "gemini-pro" },
  ];

  let lastError;

  for (const config of configs) {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );
      return res.data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      if (error.response) {
        console.warn(`[Gemini] ${config.version}/${config.model} - ${error.response.status}:`, error.response.data);
      } else {
        console.warn(`[Gemini] ${config.version}/${config.model} - ${error.message}`);
      }
      lastError = error;
    }
  }

  throw new Error(`Tất cả cấu hình Gemini đều thất bại. Lỗi cuối: ${lastError?.message}`);
}
