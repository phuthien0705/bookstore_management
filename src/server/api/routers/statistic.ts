import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import ExcelJs from "exceljs";
import fs from "fs";
import path from "path";
import { z } from "zod";

export const statisticRouter = createTRPCRouter({
  // báo cáo tồn
  createBookLeftStatistic: protectedProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
        bookCount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { month, year, bookCount } = input;

      const DanhSachSach = await ctx.prisma.sACH.findMany({
        orderBy: {
          MaSach: "desc",
        },
        take: bookCount,
      });

      return ctx.prisma.bAOCAOTON.createMany({
        data: DanhSachSach.map(({ MaSach, SoLuongTon }) => ({
          MaSach: MaSach,
          Thang: month,
          Nam: year,
          TonCuoi: SoLuongTon,
          TonDau: SoLuongTon,
          PhatSinh: 0,
        })),
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
    .mutation(async ({ input, ctx }) => {
      const { maSach, month, year, quantity } = input;

      await ctx.prisma.bAOCAOTON.update({
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

      await ctx.prisma.sACH.update({
        where: {
          MaSach: maSach,
        },
        data: {
          SoLuongTon: {
            increment: quantity,
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
        skip: cursor ? 1 : 0,
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
        cursor: records[limit - 1]?.MaSach,
        hasNextPage: !!records[limit - 1]?.MaSach,
      };
    }),

  exportBookLeftExcel: protectedProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { month, year } = input;

      const pathStorageCode = path.join(
        __dirname,
        `../../../../../public/excel/bao-cao-ton.xlsx`
      );

      const newWorkBook = new ExcelJs.Workbook();

      const newWorkSheet = newWorkBook.addWorksheet("report");

      newWorkSheet.getCell(1, 1).value = "Tháng";
      newWorkSheet.getCell(1, 2).value = month;

      newWorkSheet.getCell(2, 1).value = "Năm";
      newWorkSheet.getCell(2, 2).value = year;

      newWorkSheet.columns = [
        { key: "MaSach" },
        { key: "TonDau" },
        { key: "PhatSinh" },
        { key: "TonCuoi" },
      ];

      newWorkSheet.getCell(3, 1).value = "Mã Sách";
      newWorkSheet.getCell(3, 2).value = "Tồn Đầu";
      newWorkSheet.getCell(3, 3).value = "Phát Sinh";
      newWorkSheet.getCell(3, 4).value = "Tồn Cuối";

      const records = await ctx.prisma.bAOCAOTON.findMany({
        where: {
          Thang: month,
          Nam: year,
        },
      });

      records.forEach((item) => {
        newWorkSheet.addRow({
          MaSach: item.MaSach,
          TonDau: Number(item.TonDau),
          PhatSinh: Number(item.PhatSinh),
          TonCuoi: Number(item.TonCuoi),
        });
      });

      await newWorkBook.xlsx.writeFile(pathStorageCode);

      const stream = fs.readFileSync(pathStorageCode).toString("base64");

      return { stream };
    }),

  // báo cáo công nợ

  createUserDebtStatistic: protectedProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
        debt: z.number(),
        maKH: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { month, year, debt, maKH } = input;

      return ctx.prisma.bAOCAOCONGNO.create({
        data: {
          MaKH: maKH,
          Thang: month,
          Nam: year,
          TonCuoi: debt,
          TonDau: debt,
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
        cursor: records[limit - 1]?.MaKH,
        hasNextPage: !!records[limit - 1]?.MaKH,
      };
    }),
});