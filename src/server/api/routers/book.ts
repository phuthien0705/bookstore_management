import { z } from "zod";

import { EFilterBook } from "@/constant/constant";
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
  updateQt: protectedProcedure
    .input(
      z.object({
        MaSach: z.number().int(),
        Quantity: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { MaSach, ...req } = input;
      return ctx.prisma.sACH.update({
        data: {
          SoLuongTon: {
            increment: -req.Quantity,
          },
        },
        where: { MaSach },
      });
    }),

  getWithPagination: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
        searchValue: z.string(),
        type: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, page, searchValue } = input;
      const [records, totalCount] = await Promise.all([
        ctx.prisma.sACH.findMany({
          skip: limit * (page - 1),
          take: limit,
          where: {
            OR:
              searchValue === ""
                ? undefined
                : input.type === EFilterBook.all
                ? [
                    {
                      MaSach: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                    {
                      NhaXuatBan: {
                        contains: searchValue,
                      },
                    },
                    {
                      NamXuatBan: {
                        contains: searchValue,
                      },
                    },
                    {
                      SoLuongTon: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                    {
                      DonGiaBan: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : input.type === EFilterBook.category
                ? [
                    {
                      DauSach: {
                        TheLoai: {
                          TenTL: {
                            contains: searchValue,
                          },
                        },
                      },
                    },
                  ]
                : input.type === EFilterBook.publisher
                ? [
                    {
                      NhaXuatBan: {
                        contains: searchValue,
                      },
                    },
                  ]
                : input.type === EFilterBook.publishYear
                ? [
                    {
                      NamXuatBan: {
                        contains: searchValue,
                      },
                    },
                  ]
                : input.type === EFilterBook.bookId
                ? [
                    {
                      MaSach: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : input.type === EFilterBook.price
                ? [
                    {
                      DonGiaBan: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : undefined,
          },
          include: {
            DauSach: {
              include: {
                TheLoai: true,
              },
            },
          },
        }),
        ctx.prisma.sACH.count({
          where: {
            OR:
              searchValue === ""
                ? undefined
                : input.type === EFilterBook.all
                ? [
                    {
                      MaSach: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                    {
                      NhaXuatBan: {
                        contains: searchValue,
                      },
                    },
                    {
                      NamXuatBan: {
                        contains: searchValue,
                      },
                    },
                    {
                      SoLuongTon: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                    {
                      DonGiaBan: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : input.type === EFilterBook.category
                ? [
                    {
                      DauSach: {
                        TheLoai: {
                          TenTL: {
                            contains: searchValue,
                          },
                        },
                      },
                    },
                  ]
                : input.type === EFilterBook.publisher
                ? [
                    {
                      NhaXuatBan: {
                        contains: searchValue,
                      },
                    },
                  ]
                : input.type === EFilterBook.publishYear
                ? [
                    {
                      NamXuatBan: {
                        contains: searchValue,
                      },
                    },
                  ]
                : input.type === EFilterBook.bookId
                ? [
                    {
                      MaSach: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : input.type === EFilterBook.price
                ? [
                    {
                      DonGiaBan: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : undefined,
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
  getAllWithTitleAndCategory: protectedProcedure.query(async ({ ctx }) => {
    const books = await ctx.prisma.sACH.findMany({
      include: {
        DauSach: {
          include: {
            TheLoai: true,
          },
        },
      },
    });

    return books;
  }),

  getSachById: protectedProcedure
    .input(z.object({ MaSach: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.sACH.findMany({
        where: {
          MaSach: input.MaSach,
        },
        include: {
          DauSach: {
            select: {
              TenDauSach: true,
            },
          },
        },
      });

      return {
        result,
      };
    }),

  getAllBookWithTitle: protectedProcedure.query(async ({ ctx }) => {
    const books = await ctx.prisma.sACH.findMany({
      include: {
        DauSach: {
          select: {
            TenDauSach: true,
          },
        },
      },
    });

    return books;
  }),

  getAllByTitleId: protectedProcedure
    .input(
      z.object({
        MaDauSach: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.sACH.findMany({
        where: {
          MaDauSach: input.MaDauSach,
        },
      });
    }),
});
