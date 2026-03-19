import express from "express";
import dotenv from "dotenv";

dotenv.config();
console.log("USE_MOCK:", process.env.USE_MOCK);

const app = express();

app.use(express.json());

import { runPipeline } from "./orchestrator/runPipeline";
import { loadMemory, clearMemory } from "./memory/memory.service";
import { getCache, setCache } from "./memory/cache.service";




app.post("/mcp/run", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Phải cung cấp prompt!" });
  }

  try {
    // 🔍 Kiểm tra Cache trước
    const cached = getCache(prompt);
    if (cached) {
      console.log(`\n💎 TRẢ VỀ TỪ CACHE (0 TOKEN): "${prompt}"\n`);
      return res.json({
        message: "Lấy từ bộ nhớ đệm ⚡",
        result: cached,
      });
    }

    const result = await runPipeline(prompt);
    
    // 💾 Lưu vào Cache cho lần sau
    setCache(prompt, result);

    res.json({
      message: "Xử lý thành công 🚀",
      result,
    });

  } catch (error: any) {
    console.error("Lỗi pipeline:", error.message);
    res.status(500).json({
      error: "Đã có lỗi xảy ra trong quá trình xử lý.",
      details: error.message,
    });
  }
});

app.get("/mcp/memory", (req, res) => {
  try {
    const memory = loadMemory();
    res.json(memory);
  } catch (error: any) {
    res.status(500).json({ error: "Không thể lấy dữ liệu memory.", details: error.message });
  }
});

app.delete("/mcp/memory", (req, res) => {
  try {
    clearMemory();
    res.json({ message: "Đã xóa sạch bộ nhớ 🗑️" });
  } catch (error: any) {
    res.status(500).json({ error: "Không thể xóa bộ nhớ.", details: error.message });
  }
});

function validateEnv() {
  const required = ["GEMINI_API_KEY", "CLAUDE_API_KEY", "OPENAI_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0 && process.env.USE_MOCK !== "true") {
    console.warn(`⚠️ Thiếu biến môi trường: ${missing.join(", ")}`);
    console.warn("Server vẫn khởi động nhưng các Agent có thể thất bại nếu không bật USE_MOCK.");
  }
}

validateEnv();

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});