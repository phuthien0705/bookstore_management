import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const accountRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        TenDangNhap: z.string(),
        MatKhau: z.string(),
        MaNhom: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tAIKHOAN.create({
        data: {
          TenDangNhap: input.TenDangNhap,
          MatKhau: input.MatKhau,
          MaNhom: input.MaNhom,
        },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tAIKHOAN.findMany();
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
        ctx.prisma.tAIKHOAN.findMany({
          skip: limit * (page - 1),
          take: limit,
          where: {
            OR: [
              {
                NhomNguoiDung: {
                  TenNhom: {
                    contains: searchValue,
                  },
                },
              },
              {
                TenDangNhap: {
                  contains: searchValue,
                },
              },
              {
                MaTK: {
                  equals: parseInt(input.searchValue, 10) || undefined,
                },
              },
            ],
          },
        }),
        ctx.prisma.tAIKHOAN.count({
          where: {
            OR: [
              {
                NhomNguoiDung: {
                  TenNhom: {
                    contains: searchValue,
                  },
                },
              },
              {
                TenDangNhap: {
                  contains: searchValue,
                },
              },
              {
                MaTK: {
                  equals: parseInt(input.searchValue, 10) || undefined,
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
  getStaffWithPagination: protectedProcedure
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
        ctx.prisma.tAIKHOAN.findMany({
          skip: limit * (page - 1),
          take: limit,
          where: {
            AND: [
              {
                OR: [
                  {
                    NhomNguoiDung: {
                      TenNhom: {
                        contains: searchValue,
                      },
                    },
                  },
                  {
                    TenDangNhap: {
                      contains: searchValue,
                    },
                  },
                  {
                    MaTK: {
                      equals: parseInt(input.searchValue, 10) || undefined,
                    },
                  },
                ],
              },
              {
                NhomNguoiDung: {
                  TenNhom: "staff",
                },
              },
            ],
          },
        }),
        ctx.prisma.tAIKHOAN.count({
          where: {
            AND: [
              {
                OR: [
                  {
                    NhomNguoiDung: {
                      TenNhom: {
                        contains: searchValue,
                      },
                    },
                  },
                  {
                    TenDangNhap: {
                      contains: searchValue,
                    },
                  },
                  {
                    MaTK: {
                      equals: parseInt(input.searchValue, 10) || undefined,
                    },
                  },
                ],
              },
              {
                NhomNguoiDung: {
                  TenNhom: "staff",
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
  update: protectedProcedure
    .input(
      z.object({
        MaTK: z.number(),
        TenDangNhap: z.string(),
        MatKhau: z.string(),
        MaNhom: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.tAIKHOAN.update({
        data: { ...input },
        where: { MaTK: input.MaTK },
      });
    }),
});
