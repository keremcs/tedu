import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/game", "/cbgame", "/calculate", "/calculatemg"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next|leaderboard|leaderboardmg|compare).*)"],
};
