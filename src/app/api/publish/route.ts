import { NextRequest, NextResponse } from "next/server";
import { saveBriefing } from "@/lib/storage";
import { Briefing } from "@/lib/types";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== process.env.PUBLISH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const briefing: Briefing = await request.json();

    if (!briefing.date || !briefing.tldr || !briefing.top_stories) {
      return NextResponse.json(
        { error: "Missing required fields: date, tldr, top_stories" },
        { status: 400 }
      );
    }

    const url = await saveBriefing(briefing);

    return NextResponse.json({
      ok: true,
      date: briefing.date,
      story_count: briefing.story_count,
      blob_url: url,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
