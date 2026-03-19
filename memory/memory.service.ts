import fs from "fs";
import path from "path";

const MEMORY_FILE = path.join(__dirname, "memory.json");

export function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  const data = fs.readFileSync(MEMORY_FILE, "utf-8");
  return JSON.parse(data);
}

export function saveMemory(data: any[]) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

export function addMemory(entry: any) {
  const memory = loadMemory();
  memory.push(entry);
  saveMemory(memory);
}

export function clearMemory() {
  saveMemory([]);
}