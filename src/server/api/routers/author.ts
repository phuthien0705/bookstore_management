import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const authorRouter = createTRPCRouter({
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
    return ctx.prisma.tACGIA.findMany({
      include: {
        CT_TACGIA: {
          include: {
            DauSach: true,
          },
        },
      },
    });
  }),
  getWithPagination: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
        searchValue: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, page, searchValue } = input;
      const [records, totalCount] = await Promise.all([
        ctx.prisma.tACGIA.findMany({
          skip: limit * (page - 1),
          take: limit,
          where: {
            OR: [
              {
                MaTG: {
                  equals: parseInt(searchValue, 10) || undefined,
                },
              },
              {
                TenTG: {
                  contains: searchValue,
                },
              },
            ],
          },
          include: {
            CT_TACGIA: {
              include: {
                DauSach: true,
              },
            },
          },
        }),
        ctx.prisma.tACGIA.count({
          where: {
            OR: [
              {
                MaTG: {
                  equals: parseInt(searchValue, 10) || undefined,
                },
              },
              {
                TenTG: {
                  contains: searchValue,
                },
              },
            ],
          },
        }),
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
