import { createTRPCRouter } from "@/server/api/trpc";
import { accountRouter } from "./routers/account";
import { authorRouter } from "./routers/author";
import { bookRouter } from "./routers/book";
import { bookEntryDetailRouter } from "./routers/bookEntryDetail";
import { bookEntryTicketRouter } from "./routers/bookEntryTicket";
import { categoryRouter } from "./routers/category";
import { groupUserRouter } from "./routers/groupUser";
import { invoiceRouter } from "./routers/invoice";
import { referenceRouter } from "./routers/reference";
import { statisticRouter } from "./routers/statistic";
import { titleRouter } from "./routers/title";

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
  invoice: invoiceRouter,
  account: accountRouter,
  statistic: statisticRouter,
  bookEntryTicket: bookEntryTicketRouter,
  bookEntryDetail: bookEntryDetailRouter,
  reference: referenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
