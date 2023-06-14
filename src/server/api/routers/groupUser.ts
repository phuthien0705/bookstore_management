import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const groupUserRouter = createTRPCRouter({
  getUserGroup: protectedProcedure
    .input(
      z.object({
        MaNhom: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.nHOMNGUOIDUNG.findFirst({
        where: {
          MaNhom: input.MaNhom,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.nHOMNGUOIDUNG.findMany();
  }),
});
