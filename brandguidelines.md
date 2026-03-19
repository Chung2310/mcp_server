# API Brand & Design Guidelines (Super Pipeline Edition)

## Visual Style (Console Dashboard)
The `mcp-server` uses a "Dashboard" logic in the console:
- **Header:** `┌───🚀 KHỞI ĐỘNG SUPER PIPELINE───┐`
- **Execution Log:** Hierarchical steps with icons `🧠`, `💻`, `🧪`, `⚡`.
- **Status Icons:** `✅` (Success), `⚠️` (Fallback/Retry), `❌` (Fatal Error).
- **Final Summary:** `┌───✨ HOÀN TẤT───┐` with duration and output path.

## Operational Philosophy
- **"Never Stop" Mindset:** Failures must trigger Fallbacks or Self-Correction (Review+Test loop).
- **Execution Log File:** Every run must generate an `execution.log` in the project output folder.
- **Design Excellence:** Any UI or Documentation generated must be "Premium" (Modern, Bold, High-Quality).

---
> [!IMPORTANT]
> These guidelines are part of the [ANTIGRAVITY_RULES.md](file:///e:/manager/mcp_server/ANTIGRAVITY_RULES.md) governance.
