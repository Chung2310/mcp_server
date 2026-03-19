import express from "express";
import { env } from "./services/env.config";
import { logger } from "./services/logger";
import { runPipeline } from "./orchestrator/runPipeline";
import { loadMemory, clearMemory } from "./memory/memory.service";
import { getCache, setCache } from "./memory/cache.service";

const app = express();
app.use(express.json());

logger.info(`Server starting in ${env.NODE_ENV} mode`);
if (env.USE_MOCK) {
  logger.warn("MOCK MODE IS ENABLED. Agents will use placeholder responses.");
}

app.post("/mcp/run", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Phải cung cấp prompt!" });
  }

  try {
    // 🔍 Kiểm tra Cache trước
    const cached = getCache(prompt);
    if (cached) {
      logger.info(`💎 CACHE HIT: "${prompt}"`);
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
    logger.error(`Pipeline error: ${error.message}`, { stack: error.stack });
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
    logger.error(`Memory load error: ${error.message}`);
    res.status(500).json({ error: "Không thể lấy dữ liệu memory.", details: error.message });
  }
});

app.delete("/mcp/memory", (req, res) => {
  try {
    clearMemory();
    res.json({ message: "Đã xóa sạch bộ nhớ 🗑️" });
  } catch (error: any) {
    logger.error(`Memory clear error: ${error.message}`);
    res.status(500).json({ error: "Không thể xóa bộ nhớ.", details: error.message });
  }
});

app.listen(env.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${env.PORT}`);
});