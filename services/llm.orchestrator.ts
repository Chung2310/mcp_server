import { callDeepSeek } from "./deepseek.service";
import { callClaude } from "./claude.service";
import { callGemini } from "./gemini.service";
import { callOpenAI } from "./openai.service";
import { logger } from "./logger";

export type LLMProvider = "deepseek" | "claude" | "gemini" | "openai";

export class LLMOrchestrator {
  private static providers: LLMProvider[] = ["deepseek", "claude", "gemini", "openai"];

  static async callWithFallback(prompt: string, isReasoner: boolean = false): Promise<string> {
    let lastError: any = null;

    for (const provider of this.providers) {
      try {
        logger.info(`LLM Request using provider: ${provider}${isReasoner ? " (Reasoner)" : ""}`);
        
        switch (provider) {
          case "deepseek":
            return await callDeepSeek(prompt, isReasoner);
          case "claude":
            return await callClaude(prompt);
          case "gemini":
            return await callGemini(prompt);
          case "openai":
            return await callOpenAI(prompt);
          default:
            throw new Error(`Provider ${provider} not implemented.`);
        }
      } catch (error: any) {
        lastError = error;
        logger.warn(`LLM Provider ${provider} failed: ${error.message}. Trying next...`);
        // Continue to next provider
      }
    }

    logger.error("All LLM providers failed.");
    throw new Error(`Super Pipeline Resilience Error: All LLM providers failed. Last error: ${lastError?.message}`);
  }
}
