import { runPipeline } from "./orchestrator/runPipeline";
import * as dotenv from "dotenv";

dotenv.config();

async function test() {
  const prompt = "Xây dựng hệ thống quản lý kho hàng (Inventory Management) bằng Node.js, sử dụng PostgreSQL và có API cho việc nhập/xuất hàng.";
  console.log(`Running test with prompt: "${prompt}"`);
  await runPipeline(prompt);
}

test().catch(err => {
  console.error("Test failed:", err);
});
