import { NextRequest, NextResponse } from "next/server";
import { getSteamLink } from "@/app/lib/steam";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title");
  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }
  const url = await getSteamLink(title);
  return NextResponse.json({ url });
}
