"use server";

import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { serviceClient } from "@/utils/supabase/service";
import { revalidatePath } from "next/cache";

const schema = z.object({
  s: z.number(),
  i0: z.number(),
  i1: z.number(),
  i2: z.number(),
  i3: z.number(),
  i4: z.number(),
  o0: z.number(),
  o1: z.number(),
  o2: z.number(),
  o3: z.number(),
  o4: z.number(),
  r1: z.number(),
  r2: z.number(),
  r3: z.number(),
  r4: z.number(),
});
type Schema = z.infer<typeof schema>;

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

export async function calculate(v: boolean, result: Schema) {
  const parsed = schema.safeParse(result);
  if (!parsed.success) return { message: "Invalid input" };

  const user = await currentUser();
  if (!user) return { message: "Login to save your score" };

  function formula(r: number, ib: number, ia: number, oa: number) {
    const og = ib - r + 1;
    const inf = ib + og;
    const to = parseFloat(og.toFixed(2));
    const ti = parseFloat(inf.toFixed(2));
    if (to === oa && ti === ia) return true;
    return false;
  }

  function mgformula(
    m: number,
    ib: number,
    ia: number,
    ob: number,
    oa: number
  ) {
    const inf = (0.25 * ib + 0.75 * (2 * m + ob)) / 1.75;
    const og = m - inf + ob;
    const ti = parseFloat(inf.toFixed(2));
    const to = parseFloat(og.toFixed(2));
    if (to === oa && ti === ia) return true;
    return false;
  }

  const board: Board = await fetch(
    v
      ? "https://tedu.vercel.app/leaderboardmg"
      : "https://tedu.vercel.app/leaderboard"
  )
    .then((res) => res.json())
    .then((j) => j.data);

  const score =
    200 -
    Math.pow(parsed.data.i1 - 2, 2) -
    Math.pow(parsed.data.i2 - 2, 2) -
    Math.pow(parsed.data.i3 - 2, 2) -
    Math.pow(parsed.data.i4 - 2, 2) +
    5 * parsed.data.o1 +
    5 * parsed.data.o2 +
    5 * parsed.data.o3 +
    5 * parsed.data.o4;
  const min0 = score < 0 ? 0 : score;
  const done = parseFloat(min0.toFixed(2));

  if (v) {
    if (
      mgformula(
        parsed.data.r1,
        parsed.data.i0,
        parsed.data.i1,
        parsed.data.o0,
        parsed.data.o1
      ) &&
      mgformula(
        parsed.data.r2,
        parsed.data.i1,
        parsed.data.i2,
        parsed.data.o1,
        parsed.data.o2
      ) &&
      mgformula(
        parsed.data.r3,
        parsed.data.i2,
        parsed.data.i3,
        parsed.data.o2,
        parsed.data.o3
      ) &&
      mgformula(
        parsed.data.r4,
        parsed.data.i3,
        parsed.data.i4,
        parsed.data.o3,
        parsed.data.o4
      )
    ) {
      if (
        done === parsed.data.s &&
        board &&
        board.some((s) => s.score < done)
      ) {
        const supabase = serviceClient();
        const { error } = await supabase.from("leaderboardmg").insert({
          user: user.emailAddresses[0].emailAddress.split(".")[0],
          score: done,
          data: result,
        });
        if (error) return { message: error.message };

        revalidatePath("/leaderboardmg");

        return { message: "Great Work!" };
      }

      return { message: "You are not in the top 5" };
    }

    return { message: "Score does not match with the server" };
  }

  if (
    formula(parsed.data.r1, parsed.data.i0, parsed.data.i1, parsed.data.o1) &&
    formula(parsed.data.r2, parsed.data.i1, parsed.data.i2, parsed.data.o2) &&
    formula(parsed.data.r3, parsed.data.i2, parsed.data.i3, parsed.data.o3) &&
    formula(parsed.data.r4, parsed.data.i3, parsed.data.i4, parsed.data.o4)
  ) {
    if (done === parsed.data.s && board && board.some((s) => s.score < done)) {
      const supabase = serviceClient();
      const { error } = await supabase.from("leaderboard").insert({
        user: user.emailAddresses[0].emailAddress.split(".")[0],
        score: done,
        data: result,
      });
      if (error) return { message: error.message };

      revalidatePath("/leaderboard");

      return { message: "Great Work!" };
    }

    return { message: "You are not in the top 5" };
  }

  return { message: "Score does not match with the server" };
}
