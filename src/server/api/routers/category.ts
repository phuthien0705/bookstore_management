import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.category.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.category.delete({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.number().int(), name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.category.update({
        data: { name: input.name },
        where: { id: input.id },
      });
    }),
});
