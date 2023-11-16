"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function JoinGame() {
  const [game, setGame] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div className="flex text-4xl">Public Goods</div>
      <div className="flex flex-col gap-4 p-4 w-[300px] bg-secondary rounded-md">
        <Input
          inputMode="numeric"
          className="text-center font-semibold"
          placeholder="Game PIN"
          value={game}
          onChange={(e) => {
            setGame(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && Number(game) > 0) {
              e.preventDefault();
              router.push(`/game/${game}`);
            }
          }}
        />
        <SignedIn>
          {Number(game) > 0 ? (
            <Button asChild>
              <a href={`/game/${game}`}>Enter</a>
            </Button>
          ) : (
            <Button disabled className="select-none">
              Enter
            </Button>
          )}
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" afterSignInUrl="/">
            <Button size={"sm"}>Sign in</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
