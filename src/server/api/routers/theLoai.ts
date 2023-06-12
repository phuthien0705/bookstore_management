import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const theLoaiDinhTuyen = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ TenTL: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tHELOAI.create({
        data: {
          TenTL: input.TenTL,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tHELOAI.findMany();
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
        ctx.prisma.tHELOAI.findMany({
          skip: limit * (page - 1),
          take: limit,
        }),
        ctx.prisma.tHELOAI.count(),
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
    .input(z.object({ MaTL: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tHELOAI.delete({
        where: { MaTL: input.MaTL },
      });
    }),
  update: protectedProcedure
    .input(z.object({ MaTL: z.number().int(), TenTL: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tHELOAI.update({
        data: { TenTL: input.TenTL },
        where: { MaTL: input.MaTL },
      });
    }),
});
