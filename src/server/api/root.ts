import { createTRPCRouter } from "@/server/api/trpc";
import { tacGiaRouter } from "./routers/tacGia";
import { theLoaiIRouter } from "./routers/theLoai";
import { sachRouter } from "./routers/sach";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tacGia: tacGiaRouter,
  theLoai: theLoaiIRouter,
  sach: sachRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
