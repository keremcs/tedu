import { currentUser } from "@clerk/nextjs";
import { serviceClient } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

type Board =
  | {
      created_at: string;
      i0: number;
      o0: number;
      id: string;
      score: number;
      user: string;
    }[]
  | undefined;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { s, i0, i1, i2, i3, i4, o1, o2, o3, o4, r1, r2, r3, r4 } =
    await request.json();

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { text: "Login to save your score" },
      {
        status: 400,
      }
    );
  }

  function formula(r: number, ib: number, ia: number, oa: number) {
    const og = ib - r + 1;
    const inf = ib + og;
    const to = parseFloat(og.toFixed(2));
    const ti = parseFloat(inf.toFixed(2));
    if (to === oa && ti === ia) return true;
    return false;
  }

  if (
    formula(r1, i0, i1, o1) &&
    formula(r2, i1, i2, o2) &&
    formula(r3, i2, i3, o3) &&
    formula(r4, i3, i4, o4)
  ) {
    const board: Board = await fetch("https://tedu.vercel.app/leaderboard")
      .then((res) => res.json())
      .then((j) => j.data);

    const score =
      200 -
      Math.pow(i1 - 2, 2) -
      Math.pow(i2 - 2, 2) -
      Math.pow(i3 - 2, 2) -
      Math.pow(i4 - 2, 2) +
      5 * o1 +
      5 * o2 +
      5 * o3 +
      5 * o4;
    const min0 = score < 0 ? 0 : score;
    const done = parseFloat(min0.toFixed(2));

    if (done === s && board && board.some((s) => s.score < done)) {
      const supabase = serviceClient();
      const { error } = await supabase.from("leaderboard").insert({
        user: user.emailAddresses[0].emailAddress.split("@")[0].split(".")[0],
        score: done,
        data: {
          s: s,
          i0: i0,
          i1: i1,
          i2: i2,
          i3: i3,
          i4: i4,
          o1: o1,
          o2: o2,
          o3: o3,
          o4: o4,
          r1: r1,
          r2: r2,
          r3: r3,
          r4: r4,
        },
      });

      if (error) {
        return NextResponse.json(
          { text: error.message },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json(
        { text: "Great Work!" },
        {
          status: 201,
        }
      );
    }

    return NextResponse.json(
      { text: "You are not in the top 5" },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    { text: "Score does not match with the server" },
    {
      status: 400,
    }
  );
}
