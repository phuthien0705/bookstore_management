import { z } from "zod";

import { EFilterBookInvoice, EFilterKHInvoice } from "@/constant/constant";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  createHD: protectedProcedure
    .input(
      z.object({
        TongTien: z.number(),
        MaKH: z.number().int(),
        MaTK: z.number().int(),
        CT_HOADON: z.array(
          z.object({
            MaSach: z.number().int(),
            SoLuong: z.number().int(),
            DonGia: z.number(),
            ThanhTien: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.hOADONBANSACH.create({
        data: { TongTien: input.TongTien, MaKH: input.MaKH, MaTK: input.MaTK },
      });
      return ctx.prisma.cT_HOADON.createMany({
        data: input.CT_HOADON.map((i) => ({
          MaHD: invoice.MaHD,
          MaSach: i.MaSach,
          SoLuong: i.SoLuong,
          DonGia: i.DonGia,
          ThanhTien: i.ThanhTien,
        })),
      });
    }),

  updateDebitOnNewInvoice: protectedProcedure
    .input(
      z.object({
        MaKH: z.number().int(),
        NoHienTai: z.number(),
        ConLai: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.kHACHHANG.update({
        data: { TienNo: input.NoHienTai + input.ConLai },
        where: { MaKH: input.MaKH },
      });
    }),

  updateDebit: protectedProcedure
    .input(
      z.object({
        MaKH: z.number().int(),
        NewDebit: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.kHACHHANG.update({
        data: { TienNo: input.NewDebit },
        where: { MaKH: input.MaKH },
      });
    }),
  createPhieuThuTien: protectedProcedure
    .input(
      z.object({
        SoTien: z.number(),

        MaKH: z.number().int(),
        MaTK: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.pHIEUTHUTIEN.create({
        data: {
          SoTien: input.SoTien,
          MaKH: input.MaKH,
          MaTK: input.MaTK,
        },
      });
    }),

  getBookWithSearch: protectedProcedure
    .input(
      z.object({
        SLTon: z.number(),
        searchValue: z.string(),
        type: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { SLTon, searchValue } = input;
      const [books] = await Promise.all([
        ctx.prisma.sACH.findMany({
          where: {
            OR:
              searchValue === ""
                ? undefined
                : input.type === EFilterBookInvoice.all
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
                    {
                      DauSach: {
                        TenDauSach: {
                          contains: searchValue,
                        },
                      },
                    },
                  ]
                : input.type === EFilterBookInvoice.bookId
                ? [
                    {
                      MaSach: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : input.type === EFilterBookInvoice.title
                ? [
                    {
                      DauSach: {
                        TenDauSach: {
                          contains: searchValue,
                        },
                      },
                    },
                  ]
                : undefined,

            NOT: {
              SoLuongTon: {
                lte: SLTon,
              },
            },
          },
          include: {
            DauSach: {
              select: {
                TenDauSach: true,
              },
            },
          },
        }),
      ]);
      return { datas: books };
    }),
  getReference: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tHAMCHIEU.findFirst();
  }),

  getKhachHangWithSearch: protectedProcedure
    .input(
      z.object({
        searchValue: z.string(),
        type: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { searchValue } = input;
      const [customers] = await Promise.all([
        ctx.prisma.kHACHHANG.findMany({
          where: {
            OR:
              searchValue === ""
                ? undefined
                : input.type === EFilterKHInvoice.all
                ? [
                    {
                      MaKH: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                    {
                      HoTen: {
                        contains: searchValue,
                      },
                    },
                    {
                      SoDienThoai: {
                        contains: searchValue,
                      },
                    },
                  ]
                : input.type === EFilterKHInvoice.MaKH
                ? [
                    {
                      MaKH: {
                        equals: parseInt(searchValue, 10) || undefined,
                      },
                    },
                  ]
                : input.type === EFilterKHInvoice.HoTen
                ? [
                    {
                      HoTen: {
                        contains: searchValue,
                      },
                    },
                  ]
                : input.type === EFilterKHInvoice.SoDienThoai
                ? [
                    {
                      SoDienThoai: {
                        contains: searchValue,
                      },
                    },
                  ]
                : undefined,
          },
        }),
      ]);
      return { datas: customers };
    }),
});
