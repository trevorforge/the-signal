import { NextRequest, NextResponse } from "next/server";
import { saveBriefing } from "@/lib/storage";
import { Briefing } from "@/lib/types";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const expectedSecret = process.env.PUBLISH_SECRET || "signal-publish-2026";
  if (!token || token !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized", debug: { hasToken: !!token, hasEnv: !!process.env.PUBLISH_SECRET } }, { status: 401 });
  }

  try {
    const briefing: Briefing = await request.json();

    if (!briefing.date || !briefing.tldr) {
      return NextResponse.json(
        { error: "Missing required fields: date, tldr" },
        { status: 400 }
      );
    }

    // Ensure v2 defaults
    if (!briefing.top_stories) briefing.top_stories = [];
    if (!briefing.product_radar) briefing.product_radar = [];
    if (!briefing.creative_intel) briefing.creative_intel = [];
    if (!briefing.knowledge_shelf) briefing.knowledge_shelf = [];
    if (!briefing.watch_list) briefing.watch_list = [];
    if (!briefing.quick_hits) briefing.quick_hits = [];

    const result = await saveBriefing(briefing);

    return NextResponse.json({
      ok: true,
      date: briefing.date,
      story_count: briefing.story_count,
      topics: briefing.topics?.length ?? 0,
      result,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
