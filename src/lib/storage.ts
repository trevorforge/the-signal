import { Briefing } from "./types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data", "briefings");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveBriefing(briefing: Briefing): void {
  ensureDir();
  const filename = `${briefing.date}.json`;
  fs.writeFileSync(
    path.join(DATA_DIR, filename),
    JSON.stringify(briefing, null, 2)
  );
}

export function getLatestBriefing(): Briefing | null {
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

export function getBriefing(date: string): Briefing | null {
  const filepath = path.join(DATA_DIR, `${date}.json`);
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content);
}

export function listBriefingDates(): string[] {
  ensureDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}
