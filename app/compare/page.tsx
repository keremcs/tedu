import Hamburger from "@/components/Hamburger";
import Comp from "@/components/Comp";

export const metadata = {
  title: "Compare Payment Plans",
};

export default function Compare() {
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
          <div className="flex w-[90px]"></div>
        </div>
      </div>
      <div className="flex grow justify-center">
        <Comp />
      </div>
    </main>
  );
}
