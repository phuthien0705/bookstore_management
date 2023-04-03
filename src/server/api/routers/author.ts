import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const authorRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.author.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.author.findMany();
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.author.delete({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.number().int(), name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.author.update({
        data: { name: input.name },
        where: { id: input.id },
      });
    }),
});
