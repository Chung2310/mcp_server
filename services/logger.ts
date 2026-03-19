import winston from "winston";
import path from "path";
import fs from "fs";
import { env } from "./env.config";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: combine(
        colorize(),
        customFormat
      ),
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    // File transport for errors only
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
});

// Helper for pipeline-specific logging
export const createPipelineLogger = (outputDir: string) => {
  return winston.createLogger({
    level: "info",
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      printf(({ message, timestamp }) => `${timestamp} - ${message}`)
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(outputDir, "execution.log"),
        options: { flags: "a" },
      }),
      new winston.transports.Console({
        format: combine(colorize(), printf(({ message }) => (message as string))),
      }),
    ],
  });
};
