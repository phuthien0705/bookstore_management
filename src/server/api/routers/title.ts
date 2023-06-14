import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const titleRouter = createTRPCRouter({
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
    getAll: protectedProcedure
    .input(
      z
        .object({
          searchValue: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ ctx, input }) => {
      if (input?.searchValue) {
        return ctx.prisma.dAUSACH.findMany({
          where: {
            OR: [
              {
                MaDauSach: {
                  equals: parseInt(input.searchValue, 10) || undefined,
                },
              },
              {
                TenDauSach: {
                  contains: input.searchValue,
                },
              },
            ],
          },
          include: {
            TheLoai: true
          },
        });
      }
      return ctx.prisma.dAUSACH.findMany({
        include: {
          TheLoai: true
        },
      });
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
        searchValue: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, page, searchValue } = input;
      const [records, totalCount] = await Promise.all([
        ctx.prisma.dAUSACH.findMany({
          skip: limit * (page - 1),
          take: limit,
          where: {
            OR: [
              {
                MaDauSach: {
                  equals: parseInt(searchValue, 10) || undefined,
                },
              },
              {
                TenDauSach: {
                  contains: searchValue,
                },
              },
            ],
          },
        }),
        ctx.prisma.dAUSACH.count({
          where: {
            OR: [
              {
                MaDauSach: {
                  equals: parseInt(searchValue, 10) || undefined,
                },
              },
              {
                TenDauSach: {
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
});
