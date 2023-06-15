import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const statisticRouter = createTRPCRouter({
  // báo cáo tồn
  createBookLeftStatistic: protectedProcedure
    .input(
      z.object({
        maSach: z.number(),
        month: z.number(),
        year: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { maSach, month, year, quantity } = input;

      return ctx.prisma.bAOCAOTON.create({
        data: {
          MaSach: maSach,
          Thang: month,
          Nam: year,
          TonCuoi: quantity,
          TonDau: quantity,
          PhatSinh: 0,
        },
      });
    }),

  updateBookLeftStatistic: protectedProcedure
    .input(
      z.object({
        maSach: z.number(),
        month: z.number(),
        year: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { maSach, month, year, quantity } = input;

      return ctx.prisma.bAOCAOTON.update({
        data: {
          PhatSinh: {
            increment: quantity,
          },
          TonCuoi: {
            increment: quantity,
          },
        },
        where: {
          MaSach_Thang_Nam: {
            MaSach: maSach,
            Thang: month,
            Nam: year,
          },
        },
      });
    }),

  getBookLeftWithPagination: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().nullish(),
        month: z.number(),
        year: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor, month, year } = input;

      const records = await ctx.prisma.bAOCAOTON.findMany({
        skip: 1,
        take: limit,
        cursor: cursor
          ? { MaSach_Thang_Nam: { MaSach: cursor, Thang: month, Nam: year } }
          : undefined,
        where: {
          Thang: month,
          Nam: year,
        },
      });

      return {
        datas: records,
        cursor: records[records.length - 1]?.MaSach,
        hasNextPage: records[records.length - 1]?.MaSach !== cursor,
      };
    }),

  // báo cáo công nợ

  createUserDebtStatistic: protectedProcedure
    .input(
      z.object({
        maKH: z.number(),
        month: z.number(),
        year: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { maKH, month, year, quantity } = input;

      return ctx.prisma.bAOCAOCONGNO.create({
        data: {
          MaKH: maKH,
          Thang: month,
          Nam: year,
          TonCuoi: quantity,
          TonDau: quantity,
          PhatSinh: 0,
        },
      });
    }),

  updateUserDebtStatistic: protectedProcedure
    .input(
      z.object({
        maKH: z.number(),
        month: z.number(),
        year: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { maKH, month, year, quantity } = input;

      return ctx.prisma.bAOCAOCONGNO.update({
        data: {
          PhatSinh: {
            increment: quantity,
          },
          TonCuoi: {
            increment: quantity,
          },
        },
        where: {
          MaKH_Thang_Nam: {
            MaKH: maKH,
            Thang: month,
            Nam: year,
          },
        },
      });
    }),

  getUserDebtWithPagination: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().nullish(),
        month: z.number(),
        year: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor, month, year } = input;

      const records = await ctx.prisma.bAOCAOCONGNO.findMany({
        skip: 1,
        take: limit,
        cursor: cursor
          ? {
              MaKH_Thang_Nam: {
                MaKH: cursor,
                Thang: month,
                Nam: year,
              },
            }
          : undefined,
        where: {
          Thang: month,
          Nam: year,
        },
      });

      return {
        datas: records,
        cursor: records[records.length - 1]?.MaKH,
        hasNextPage: records[records.length - 1]?.MaKH !== cursor,
      };
    }),
});
