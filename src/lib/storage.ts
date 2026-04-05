import { Briefing } from "./types";
import { put, list, head } from "@vercel/blob";

const PREFIX = "briefings/";

export async function saveBriefing(briefing: Briefing): Promise<string> {
  const filename = `${PREFIX}${briefing.date}.json`;
  const blob = await put(filename, JSON.stringify(briefing), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  return blob.url;
}

export async function getLatestBriefing(): Promise<Briefing | null> {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });

  if (blobs.length === 0) return null;

  // Sort by pathname (date-based) descending
  const sorted = blobs.sort((a, b) =>
    b.pathname.localeCompare(a.pathname)
  );

  const response = await fetch(sorted[0].url);
  return response.json();
}

export async function getBriefing(
  date: string
): Promise<Briefing | null> {
  const { blobs } = await list({ prefix: `${PREFIX}${date}` });
  if (blobs.length === 0) return null;

  const response = await fetch(blobs[0].url);
  return response.json();
}

export async function listBriefingDates(): Promise<string[]> {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  return blobs
    .map((b) => b.pathname.replace(PREFIX, "").replace(".json", ""))
    .sort()
    .reverse();
}
