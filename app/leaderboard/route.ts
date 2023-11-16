import { serviceClient } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = serviceClient();
  const data = await supabase
    .from("leaderboard")
    .select("id, user, created_at, score, data -> i0")
    .order("score", { ascending: false })
    .limit(5);
  return NextResponse.json(data);
}