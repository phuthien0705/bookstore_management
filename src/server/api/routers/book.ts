import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        NhaXuatBan: z.string(),
        NamXuatBan: z.string(),
        DonGiaBan: z.number(),
        SoLuongTon: z.number().int(),
        MaDauSach: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.sACH.create({
        data: { ...input },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ MaSach: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.sACH.delete({
        where: { MaSach: input.MaSach },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        MaSach: z.number().int(),
        NhaXuatBan: z.string(),
        NamXuatBan: z.string(),
        DonGiaBan: z.number(),
        SoLuongTon: z.number().int(),
        MaDauSach: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { MaSach, ...req } = input;
      return ctx.prisma.sACH.update({
        data: { ...req },
        where: { MaSach },
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
        ctx.prisma.sACH.findMany({
          skip: limit * (page - 1),
          take: limit,
        }),
        ctx.prisma.sACH.count(),
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
