import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_FILE = path.join(__dirname, "cache.json");

function getHash(text: string) {
  return crypto.createHash("md5").update(text).digest("hex");
}

export function getCache(prompt: string): any | null {
  if (!fs.existsSync(CACHE_FILE)) return null;
  const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  const hash = getHash(prompt);
  return cache[hash] || null;
}

export function setCache(prompt: string, data: any) {
  let cache: any = {};
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  }
  const hash = getHash(prompt);
  cache[hash] = data;
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}
