import CBGame from "@/components/CBGame";
import Hamburger from "@/components/Hamburger";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function CBIndex() {
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
            <SignedIn>
              <UserButton afterSignOutUrl="/cbgame" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" afterSignInUrl="/cbgame">
                <Button size={"sm"}>Sign in</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
      <div className="flex grow justify-center">
        <CBGame />
      </div>
    </main>
  );
}
