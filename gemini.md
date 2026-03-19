# Project Context: mcp-server (Super Pipeline)

## Tech Stack
- **Language:** TypeScript (Strict Mode)
- **Environment:** Node.js (CommonJS)
- **Architecture:** Multi-Agent Orchestration

## Core Orchestration (5-Agent Super Pipeline)
The system follows a sequential yet resilient pipeline managed in `orchestrator/runPipeline.ts`:
1.  **Analysis Agent:** DeepSeek R1 -> JSON Task.
2.  **Design Agent:** DeepSeek Chat -> `System_Design.md`.
3.  **Dev Agent:** DeepSeek R1 -> Code.
4.  **Self-Correction Loop:** Review Agent (DeepSeek R1) + Test Agent (DeepSeek Chat) with up to 3 retries on failure.
5.  **Doc & Parallel Export:** Doc Agent + File Output executed in parallel.

## Resilience & Governance
- **Fallback Hierarchy:** DeepSeek > Claude > Gemini > OpenAI.
- **Rules:** Every agent must follow `rules/*.rule.ts` and the global `ANTIGRAVITY_RULES.md`.
- **Output:** All project data saved in dedicated kebab-case folders in `outputs/`.

---
> [!NOTE]
> For any development task, refer to [ANTIGRAVITY_RULES.md](file:///e:/manager/mcp_server/ANTIGRAVITY_RULES.md).
