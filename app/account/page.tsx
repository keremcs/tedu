import { currentUser, UserButton } from "@clerk/nextjs";
import Hamburger from "@/components/Hamburger";

export const dynamic = "force-dynamic";

export default async function Account() {
  const user = await currentUser();
  return (
    <div className="min-h-screen flex flex-col">
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
      <div className="flex grow justify-center items-center text-4xl">
        Welcome {user?.emailAddresses[0].emailAddress.split("@")[0]}
      </div>
    </div>
  );
}
