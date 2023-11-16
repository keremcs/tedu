import { currentUser, UserButton } from "@clerk/nextjs";
import { serviceClient } from "@/utils/supabase/service";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import DeezButton from "@/components/DeezButton";
import Hamburger from "@/components/Hamburger";
import Messages from "@/components/Messages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Public Goods Game",
};

export default async function Game({ params }: { params: { id: number } }) {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  const plain = user.emailAddresses[0].emailAddress.split("@")[0];

  const supabaseRole = serviceClient();
  const { data: game, error: gameError } = await supabaseRole
    .from("games")
    .select("active, period, logs (amount, period, player)")
    .eq("id", params.id);
  if (gameError) {
    redirect(`/game?error=${gameError.message}`);
  }
  if (game.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex flex-row justify-center border-b h-[57px]">
          <div className="flex items-center justify-between max-w-4xl w-full px-4">
            <div className="flex w-[90px] justify-start">
              <Hamburger />
            </div>
            <a href="/" className="hidden sm:flex text-3xl font-bold">
              TEDU Games
            </a>
            <div className="flex w-[90px] justify-end">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
        <div className="flex grow justify-center">
          <div className="flex items-center text-2xl sm:text-4xl">
            Game does not exist
          </div>
        </div>
      </main>
    );
  }

  const { data: player, error: playerError } = await supabaseRole
    .from("players")
    .select("balance")
    .eq("player", plain)
    .eq("game", params.id);
  if (playerError) {
    redirect(`/game?error=${playerError.message}`);
  }
  let balance = player[0]?.balance;
  if (player.length === 0) {
    const { data, error } = await supabaseRole
      .from("players")
      .insert({
        player: plain,
        game: params.id,
      })
      .select();
    if (error) {
      redirect(`/game?error=${error.message}`);
    }
    balance = data[0].balance;
  }

  async function play(formData: FormData) {
    "use server";
    const supabaseServerRole = serviceClient();
    const schema = z.object({
      number: z.number().min(0).max(balance),
    });
    const parsed = schema.safeParse({
      number: Number(formData.get("number")),
    });
    if (!parsed.success) {
      redirect(`/game/${params.id}?error=Invalid%20number`);
    }
    const fxd = parseFloat(parsed.data.number.toFixed(2));
    const { error: poolError } = await supabaseServerRole.rpc("addpool", {
      amount: fxd,
      game_id: params.id,
      perio: game![0].period,
    });
    if (poolError) {
      redirect(`/game/${params.id}?error=Pool%20error`);
    }
    const newBalance = balance - fxd;
    const fxdB = parseFloat(newBalance.toFixed(2));
    const { error: balanceError } = await supabaseServerRole
      .from("players")
      .update({ balance: fxdB })
      .eq("player", plain)
      .eq("game", params.id);
    if (balanceError) {
      redirect(`/game/${params.id}?error=Balance%20update%20error`);
    }
    const { error: logError } = await supabaseServerRole.from("logs").insert({
      game: params.id,
      amount: fxd,
      period: game![0].period,
      player: plain,
    });
    if (logError) {
      redirect(`/game/${params.id}?error=Log%20error`);
    }

    redirect(`/game/${params.id}`);
  }

  if (!game[0].active) {
    const g = game[0].logs.filter((u) => u.player === plain && u.period === 0);
    const c = g[0]?.amount ?? 0;
    const r = 10 - c;
    const w = balance - r;
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex flex-row justify-center border-b h-[57px]">
          <div className="flex items-center justify-between max-w-4xl w-full px-4">
            <div className="flex w-[90px] justify-start">
              <Hamburger />
            </div>
            <a href="/" className="hidden sm:flex text-3xl font-bold">
              TEDU Games
            </a>
            <div className="flex w-[90px] justify-end">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
        <div className="flex grow justify-center">
          <div className="flex flex-col justify-center items-center gap-8">
            {game[0].period === 1 ? (
              <>
                <div className="flex text-2xl">Your contribution: ${c}</div>
                <div className="flex text-2xl">
                  Remaining balance: ${parseFloat(r.toFixed(2))}
                </div>
                <div className="flex text-2xl">
                  Your reward: ${parseFloat(w.toFixed(2))}
                </div>
              </>
            ) : (
              <div className="flex font-semibold text-4xl text-red-500">
                Game Over
              </div>
            )}
            <div className="flex text-2xl">
              Balance: ${parseFloat(balance.toFixed(2))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (
    game[0].logs
      .filter((u) => u.player === plain)
      .some((p) => p.period === game[0].period)
  )
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex flex-row justify-center border-b h-[57px]">
          <div className="flex items-center justify-between max-w-4xl w-full px-4">
            <div className="flex w-[90px] justify-start">
              <Hamburger />
            </div>
            <a href="/" className="hidden sm:flex text-3xl font-bold">
              TEDU Games
            </a>
            <div className="flex w-[90px] justify-end">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
        <div className="flex grow justify-center">
          <div className="flex items-center text-2xl sm:text-4xl">
            Wait for the next round
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex flex-row justify-center border-b h-[57px]">
        <div className="flex items-center justify-between max-w-4xl w-full px-4">
          <div className="flex w-[90px] justify-start">
            <Hamburger />
          </div>
          <a href="/" className="hidden sm:flex text-3xl font-bold">
            TEDU Games
          </a>
          <div className="flex w-[90px] justify-end">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
      <div className="flex grow justify-center">
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="flex text-4xl">
            Balance: ${parseFloat(balance.toFixed(2))}
          </div>
          <form
            action={play}
            className="flex flex-col gap-4 p-4 w-[300px] bg-secondary rounded-md"
          >
            <Input
              type="number"
              inputMode="numeric"
              name="number"
              className="text-center font-semibold"
              placeholder="Your contribution"
              min={0}
              step={0.01}
              max={balance}
              required
            />
            <DeezButton />
          </form>
          <Messages />
        </div>
      </div>
    </main>
  );
}
