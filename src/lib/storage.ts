import { Briefing } from "./types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data", "briefings");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function saveBriefing(briefing: Briefing): Promise<string> {
  ensureDir();
  const filename = `${briefing.date}.json`;
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(briefing, null, 2));
  return filepath;
}

export async function getLatestBriefing(): Promise<Briefing | null> {
  ensureDir();
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const content = fs.readFileSync(path.join(DATA_DIR, files[0]), "utf-8");
  return JSON.parse(content);
}

export async function listBriefingDates(): Promise<string[]> {
  ensureDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}
