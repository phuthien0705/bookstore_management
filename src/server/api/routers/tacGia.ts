import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const tacGiaDinhTuyen = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ TenTG: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tACGIA.create({
        data: {
          TenTG: input.TenTG,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tACGIA.findMany();
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
        ctx.prisma.tACGIA.findMany({
          skip: limit * (page - 1),
          take: limit,
        }),
        ctx.prisma.tACGIA.count(),
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
    .input(z.object({ MaTG: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tACGIA.delete({
        where: { MaTG: input.MaTG },
      });
    }),
  update: protectedProcedure
    .input(z.object({ MaTG: z.number().int(), TenTG: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tACGIA.update({
        data: { TenTG: input.TenTG },
        where: { MaTG: input.MaTG },
      });
    }),
});
