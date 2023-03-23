import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const loginRouter = createTRPCRouter({
  getAccount: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.account.findUnique({
        where: {
          username: input.username,
        },
      });
    }),
});
