import { currentUser } from "@clerk/nextjs";
import { serviceClient } from "@/utils/supabase/service";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Messages from "@/components/Messages";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Page",
};

export default async function Admin() {
  const user = await currentUser();
  if (!user || user.id !== "user_2YGh2CbZELEGIWfy5W9PEOdtJbO") {
    redirect("/");
  }

  const supabase = serviceClient();
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*, players(count)");
  if (gamesError) {
    redirect(`/admin?error=${gamesError.message}`);
  }

  async function newGame() {
    "use server";
    const supabaseRoleG = serviceClient();
    const { error } = await supabaseRoleG.from("games").insert({
      pool: 0,
    });

    if (error) {
      redirect(`/admin?error=${error.message}`);
    }
    redirect("/admin");
  }

  async function nextPeriod(formData: FormData) {
    "use server";
    const supabaseRoleP = serviceClient();
    const game = Number(formData.get("game"));
    const per = Number(formData.get("per"));
    const poo = Number(formData.get("poo"));
    const count = Number(formData.get("count"));

    const perPlayer = (poo * 2) / count;
    const fxd = parseFloat(perPlayer.toFixed(2));
    const { error: poolError } = await supabaseRoleP.rpc("poolfn", {
      amount: fxd,
      game_id: game,
    });
    if (poolError) {
      redirect(`/admin?error=${poolError.message}`);
    }

    const { error: concerneD } = await supabaseRoleP
      .from("games")
      .update({
        period: per,
        pool: 0,
      })
      .eq("id", game);
    if (concerneD) {
      redirect(`/admin?error=${concerneD.message}`);
    }

    redirect("/admin");
  }

  async function endGame(formData: FormData) {
    "use server";
    const supabaseRoleEG = serviceClient();
    const game = Number(formData.get("game"));
    const { error } = await supabaseRoleEG
      .from("games")
      .update({
        active: false,
      })
      .eq("id", game);
    if (error) {
      redirect(`/admin?error=${error.message}`);
    }

    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex flex-col justify-center items-center gap-12">
        <form action={newGame} className="flex flex-col gap-2">
          <Button>Create A New Game</Button>
        </form>
        <div className="flex flex-col gap-2 p-8">
          <ul className="flex flex-col gap-10">
            {games
              .sort((a, b) => b.id - a.id)
              .map((g) => (
                <li
                  key={g.id}
                  className="flex flex-row justify-between items-center gap-4"
                >
                  <div className="flex flex-wrap gap-1">
                    <div>Game: {g.id},</div>
                    <div>Players: {g.players[0].count},</div>
                    <div>Period: {g.period},</div>
                    <div>Pool: {g.pool}</div>
                  </div>
                  {g.active ? (
                    <div className="flex gap-4">
                      <form action={nextPeriod}>
                        <Button size={"sm"}>Next Period</Button>
                        <input name="game" value={g.id} readOnly hidden />
                        <input
                          name="per"
                          value={g.period + 1}
                          readOnly
                          hidden
                        />
                        <input name="poo" value={g.pool} readOnly hidden />
                        <input
                          name="count"
                          value={g.players[0].count}
                          readOnly
                          hidden
                        />
                      </form>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size={"sm"} variant="destructive">
                            End Game
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              The game will end and players will not be able to
                              access the game.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-4">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form action={endGame}>
                              <AlertDialogAction
                                type="submit"
                                className="w-full"
                              >
                                Continue
                              </AlertDialogAction>
                              <input name="game" value={g.id} readOnly hidden />
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <span className="text-red-500">Game Over</span>
                  )}
                </li>
              ))}
          </ul>
          <Messages />
        </div>
      </div>
    </div>
  );
}
