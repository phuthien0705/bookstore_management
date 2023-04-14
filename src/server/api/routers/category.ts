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
  getWithPagination: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, page } = input;
      const [records, totalCount] = await Promise.all([
        ctx.prisma.category.findMany({
          skip: limit * (page - 1),
          take: limit,
        }),
        ctx.prisma.category.count(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const havePrevPage = page > 1;
      const haveNextPage = page < totalPages;

      return {
        datas: records,
        havePrevPage,
        haveNextPage,
        totalPages,
      };
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
