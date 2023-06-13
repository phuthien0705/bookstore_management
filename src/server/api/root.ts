import { createTRPCRouter } from "@/server/api/trpc";
import { authorRouter } from "./routers/author";
import { categoryRouter } from "./routers/category";
import { bookRouter } from "./routers/book";
import { titleRouter } from "./routers/title";
import { groupUserRouter } from "./routers/groupUser";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  author: authorRouter,
  category: categoryRouter,
  book: bookRouter,
  title: titleRouter,
  groupUser: groupUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
