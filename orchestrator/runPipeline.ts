import { analysisAgent } from "../agents/analysis.agent";
import { analysisDocAgent } from "../agents/analysis-doc.agent";
import { devAgent } from "../agents/dev.agent";
import { reviewAgent } from "../agents/review.agent";
import { testAgent } from "../agents/test.agent";
import { docAgent } from "../agents/doc.agent";
import { addMemory } from "../memory/memory.service";
import { createPipelineLogger } from "../services/logger";
import fs from "fs";
import path from "path";

/**
 * Super Pipeline: Loop-Correction, Parallelism & Dashboard Logging.
 */
export async function runPipeline(prompt: string) {
  const startTime = Date.now();
  
  const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
  const outputDir = path.join(process.cwd(), "outputs", slug || "unnamed");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const log = createPipelineLogger(outputDir);

  log.info(`\n┌─────────────────────────────────────────────────────────────┐`);
  log.info(`│ 🚀 KHỞI ĐỘNG SUPER PIPELINE (DeepSeek x Parallel x Loop)    │`);
  log.info(`└─────────────────────────────────────────────────────────────┘\n`);

  // --- Step 1 & 2: Analysis & Design ---
  log.info(`[Step 1/2] 🧠 Phân tích & 📝 Thiết kế hệ thống...`);
  const analysis = await analysisAgent(prompt);
  const detailedDoc = await analysisDocAgent(analysis);
  fs.writeFileSync(path.join(outputDir, "System_Design.md"), detailedDoc);
  log.info(`✅ Thiết kế xong: outputs/${slug}/System_Design.md`);

  // --- Step 3: Development ---
  log.info(`[Step 3] 💻 Phát triển mã nguồn ban đầu...`);
  let dev = await devAgent(analysis);
  const originalDev = { ...dev };
  log.info(`✅ Code gốc hoàn tất.`);

  // --- Step 4 & 5 Loop: Review & Test (Self-Correction) ---
  let retries = 0;
  const MAX_RETRIES = 2;
  let testResult: any;
  let reviewedDev = dev;
  let lastError = "";

  while (retries <= MAX_RETRIES) {
    log.info(`[Step 4] 🧐 Đánh giá & Tối ưu hóa (Lần ${retries + 1})...`);
    reviewedDev = await reviewAgent(reviewedDev, lastError);
    
    log.info(`[Step 5] 🧪 Kiểm thử mã nguồn...`);
    testResult = await testAgent(reviewedDev);

    if (testResult.status === "PASSED") {
      log.info(`✅ KIỂM THỬ THÀNH CÔNG (Sau ${retries} lần sửa).`);
      break;
    } else {
      retries++;
      lastError = testResult.test_result || "Lỗi không xác định";
      log.info(`⚠️ KIỂM THỬ THẤT BẠI. Đang chuẩn bị sửa lỗi (Retry ${retries}/${MAX_RETRIES})...`);
      if (retries > MAX_RETRIES) log.info(`❌ Đã hết lượt sửa lỗi. Chấp nhận kết quả hiện tại.`);
    }
  }

  // --- Step 6: Parallel Documentation & Exports ---
  log.info(`[Step 6] ⚡ Đang chạy song song: Tạo tài liệu & Xuất file...`);
  
  const [doc] = await Promise.all([
    docAgent(analysis, reviewedDev),
    (async () => {
      const ext = reviewedDev.language === "python" ? "py" : (reviewedDev.language === "typescript" ? "ts" : "js");
      fs.writeFileSync(path.join(outputDir, `index.${ext}`), reviewedDev.code);
      fs.writeFileSync(path.join(outputDir, `original-index.${ext}`), originalDev.code);
    })()
  ]);

  fs.writeFileSync(path.join(outputDir, "README.md"), doc);
  log.info(`✅ Tài liệu (README.md) hoàn tất.`);

  // --- Finalization ---
  addMemory({ prompt, analysis, dev: reviewedDev, test: testResult, doc, originalDev });
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  log.info(`\n┌─────────────────────────────────────────────────────────────┐`);
  log.info(`│ ✨ HOÀN TẤT TRONG ${duration}S                                    │`);
  log.info(`│ 📂 Kết quả lưu tại: outputs/${slug}                    │`);
  log.info(`└─────────────────────────────────────────────────────────────┘\n`);

  return { analysis, dev: reviewedDev, test: testResult, doc };
}