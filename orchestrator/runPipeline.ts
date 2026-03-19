import { analysisAgent } from "../agents/analysis.agent";
import { devAgent } from "../agents/dev.agent";
import { testAgent } from "../agents/test.agent";
import { addMemory } from "../memory/memory.service";
import fs from "fs";
import path from "path";

export async function runPipeline(prompt: string) {
  console.log(`\n--- 🚀 Bắt đầu Pipeline cho: "${prompt}" ---`);

  console.log(`[Step 1] 🧠 Đang gọi Analysis Agent (Gemini)...`);
  const analysis = await analysisAgent(prompt);
  console.log(`✅ Phân tích xong: ${analysis.project_name || "untitled"}`);

  console.log(`[Step 2] 💻 Đang gọi Dev Agent (Claude)...`);
  const dev = await devAgent(analysis);
  console.log(`✅ Đã viết xong code (${dev.language})`);

  console.log(`[Step 3] 🧪 Đang gọi Test Agent (OpenAI)...`);
  const test = await testAgent(dev);
  console.log(`✅ Kiểm thử hoàn tất: ${test.status}`);

  const result = { prompt, analysis, dev, test };

  console.log(`[Step 4] 💾 Đang lưu vào bộ nhớ JSON...`);
  addMemory(result);


  // 📂 Tự động xuất code ra file riêng
  try {
    const outputDir = path.join(process.cwd(), "outputs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const projectName = analysis.project_name || "untitled-project";
    const ext = dev.language === "python" ? "py" : (dev.language === "javascript" ? "js" : "txt");
    const filename = `${projectName}.${ext}`;
    const filePath = path.join(outputDir, filename);

    fs.writeFileSync(filePath, dev.code);
    console.log(`\n💾 Đã tự động lưu code tại: ${filePath}\n`);
  } catch (err: any) {
    console.error("❌ Lỗi khi xuất code ra file:", err.message);
  }

  return result;
}