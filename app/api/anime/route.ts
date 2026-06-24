import { NextRequest, NextResponse } from "next/server";
import { getAnimePage } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");

  const genre = searchParams.get("genre") ?? undefined;
  const season = searchParams.get("season") ?? undefined;
  const year = searchParams.get("year") ?? undefined;
  const format = searchParams.get("format") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const data = await getAnimePage(page, {
    genre,
    season,
    year,
    format,
    status,
  });

  return NextResponse.json(data);
}