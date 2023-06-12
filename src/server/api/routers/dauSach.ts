import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const dauSachDinhTuyen = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        TenDauSach: z.string(),
        MaTL: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.dAUSACH.create({
        data: { ...input },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.dAUSACH.findMany();
  }),
  delete: protectedProcedure
    .input(z.object({ MaDauSach: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.dAUSACH.delete({
        where: { MaDauSach: input.MaDauSach },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        MaDauSach: z.number().int(),
        TenDauSach: z.string(),
        MaTL: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { MaDauSach, ...req } = input;
      return ctx.prisma.dAUSACH.update({
        data: { ...req },
        where: { MaDauSach },
      });
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
        ctx.prisma.dAUSACH.findMany({
          skip: limit * (page - 1),
          take: limit,
        }),
        ctx.prisma.dAUSACH.count(),
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
});