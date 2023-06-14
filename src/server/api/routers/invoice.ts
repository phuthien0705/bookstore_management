import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  getKhachHang: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.kHACHHANG.findMany();
  }),
  getKhachHangById: protectedProcedure
    .input(z.object({ MaKH: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.kHACHHANG.findUnique({
        where: {
          MaKH: input.MaKH,
        },
      });

      return {
        result,
      };
    }),
});
