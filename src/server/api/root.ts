import { createTRPCRouter } from "@/server/api/trpc";
import { tacGiaDinhTuyen } from "./routers/tacGia";
import { theLoaiDinhTuyen } from "./routers/theLoai";
import { sachDinhTuyen } from "./routers/sach";
import { dauSachDinhTuyen } from "./routers/dauSach";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tacGia: tacGiaDinhTuyen,
  theLoai: theLoaiDinhTuyen,
  sach: sachDinhTuyen,
  dauSach: dauSachDinhTuyen,
});

// export type definition of API
export type AppRouter = typeof appRouter;
